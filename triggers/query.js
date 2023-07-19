const _ = require("lodash");
const sample = require("../samples/sample_query");

const triggerQuery = async (z, bundle) => {

  const pipesUrl = new URL(bundle.authData.cloud_host);
  pipesUrl.pathname = "api/latest/actor/workspace";

  const listActorWorkspaces = z.request({
    url: pipesUrl.href,
    method: "GET",
  });

  const queryResponse = listActorWorkspaces.then((workspaceResponse) => {
    const workspaces = z.JSON.parse(workspaceResponse.content)?.items;

    // Get the metadata of the workspace requested
    let matchedWorkspace = _.find(workspaces, function (o) {
      return (
        `${o.identity.handle}/${o.handle}` == bundle.inputData.workspace_handle
      );
    });

    // Create the URL to perform a query in a user/organization workspace
    pipesUrl.pathname = `api/latest/${matchedWorkspace.identity.type}/${matchedWorkspace.identity.handle}/workspace/${matchedWorkspace.handle}/query`;

    return z.request({
      url: pipesUrl.href,
      method: "POST",
      body: {
        sql: bundle.inputData.query,
      },
    });
  });

  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Query timed out after 30 seconds, please update the query to complete on time"));
    }, 29500); // Set a timeout of 29.5 seconds to trigger before the default timeout
  });

  try {
    // Wait for either queryResponse or timeoutPromise to resolve or reject, whichever happens first.
    // If queryResponse resolves first, return the response; else
    // throw an error for the timeout with the custom error message.
    const result = await Promise.race([queryResponse, timeoutPromise]);

    if (result instanceof Error) {
      return new z.errors.HaltedError(result.message)
    }

    const items = z.JSON.parse(result.content)?.items;
    if (items == null) {
      return [];
    }

    // Query results must have a unique id field so that we can deduplicate records properly
    return items.map((obj, i) => {
      if (obj.id != null) {
        return obj;
      }

      let hash = z.hash("md5", z.JSON.stringify(obj));
      return {
        ...obj,
        id: hash,
      };
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  key: "query",
  noun: "Query",

  display: {
    label: "New Row (Custom Query)",
    description:
      "Triggers when new rows are returned by a custom query that you provide.",
  },

  operation: {
    inputFields: [
      {
        key: "workspace_handle",
        required: true,
        label: "Workspace",
        helpText:
          "The Turbot Pipes [Workspace](https://turbot.com/pipes/docs/workspaces) to connect to.",
        dynamic: "workspace.name",
      },
      {
        key: "query",
        type: "string",
        required: true,
        label: "Query",
        placeholder: "select * from cloud;",
        helpText:
          "Query results must have a unique ID field so we can deduplicate records properly! Otherwise we will make a best guess. You must also include desired ordering and limiting in the query. **Note**: This query must run in less than 30 seconds and return no more than 3,000 rows.",
      },
    ],
    perform: triggerQuery,
    sample: sample,
  },
};
