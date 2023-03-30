const _ = require("lodash");
const sample = require("../samples/sample_query");

const triggerQuery = async (z, bundle) => {

  const spcUrl = new URL(bundle.authData.cloud_host);

  // List all the workspaces the actor has access to
  spcUrl.pathname = "api/latest/actor/workspace"
  const listWorkspacesResponse = await z.request({
    method: "GET",
    url: spcUrl.href,
  });
  const workspaces = z.JSON.parse(listWorkspacesResponse.content)?.items;

  // Get the metadata of the workspace requested
  let matchedWorkspace = _.find(workspaces, function(o) { return `${o.identity.handle}/${o.handle}` == bundle.inputData.workspace_handle; });

  // Create the URL to to perform a query in a user/organization workspace
  spcUrl.pathname = `api/latest/${matchedWorkspace.identity.type}/${matchedWorkspace.identity.handle}/workspace/${matchedWorkspace.handle}/query`;

  spcUrl.searchParams.append("sql", bundle.inputData.query)
  const response = await z.request({
    method: "POST",
    url: spcUrl.href,
  });

  const items = z.JSON.parse(response.content)?.items;

  if (items == null) {
    z.console.log('Got Empty Response')
    return [];
  }
  z.console.log('Response size: ', items.length)

  // Query results must have a unique id field so that we can deduplicate records properly
  return items.map((obj, i) => {
    if (obj.id != null) {
      return obj;
    }

    let hash = z.hash('md5', z.JSON.stringify(obj))
    return {
      ...obj,
      id: hash,
    };
  });
};

module.exports = {
  key: "query",
  noun: "Query",

  display: {
    label: "New Row (Custom Query)",
    description: "Triggers when new rows are returned by a custom query that you provide.",
  },

  operation: {
    inputFields: [
      {
        key: 'workspace_handle',
        required: true,
        label: 'Workspace',
        helpText: 'The Steampipe Cloud [Workspace](https://steampipe.io/docs/cloud/workspaces) to connect to.',
        dynamic: 'workspace.name'
      },
      {
        key: 'query',
        type: 'string',
        required: true,
        label: 'Query',
        placeholder: 'select * from cloud;',
        helpText: 'Query results must have a unique ID field so we can deduplicate records properly! Otherwise we will make a best guess. You must also include desired ordering and limiting in the query. **Note**: This query must run in less than 30 seconds and return no more than 3,000 rows.',
      }
    ],
    perform: triggerQuery,
    sample: sample,
  },
};
