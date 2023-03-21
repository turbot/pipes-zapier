const _ = require("lodash");
const sample = require("../samples/sample_query");

const triggerQuery = async (z, bundle) => {

  // Extract the actor handle and workspace handle from the given input, e.g. acme/myworkspace
  let splitWorkspaceHandle = bundle.inputData.workspace_handle.split("/")
  if (splitWorkspaceHandle.length < 1) {
    return
  }
  let identityHandle = splitWorkspaceHandle[0]
  let workspaceHandle = splitWorkspaceHandle[1]

  // If the actor handle in the given input field matches with the current authenticated actor handle, then
  // the selected workspace is a user workspace
  // else, it is an organization workspace.
  let workspaceType = identityHandle == bundle.authData.handle ? "user" : "org"

  // Create the URL to to perform a query in a user/organization workspace
  const spcUrl = new URL('https://cloud.steampipe.io/');
  spcUrl.pathname = `api/latest/${workspaceType}/${identityHandle}/workspace/${workspaceHandle}/query`;

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
    label: "Query",
    description: "Triggered when new rows are returned by a custom query that you provide.",
  },

  operation: {
    inputFields: [
      {
        key: 'workspace_handle',
        required: true,
        label: 'Workspace',
        helpText: 'The Steampipe Cloud [Workspace](https://steampipe.io/docs/cloud/workspaces) to connect to.',
        dynamic: 'workspace.handle'
      },
      {
        key: 'query',
        type: 'string',
        required: true,
        label: 'Query',
        placeholder: 'select * from cloud;',
        helpText: 'Query results must have a unique id field so we can deduplicate records properly! Otherwise we will make a best guess. You must also include desired ordering and limiting in the query. **Note**: This query must run in less than 30 seconds and return no more than 3,000 rows.',
      }
    ],
    perform: triggerQuery,
    sample: sample,
  },
};
