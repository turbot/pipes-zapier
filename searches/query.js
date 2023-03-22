const _ = require("lodash");
const sample = require("../samples/sample_query");

const searchQuery = async (z, bundle) => {

  // List all the workspaces the actor has access to
  const listWorkspacesResponse = await z.request({
    method: "GET",
    url: `https://cloud.steampipe.io/api/latest/actor/workspace`,
  });
  const workspaces = z.JSON.parse(listWorkspacesResponse.content)?.items;

  // Get the metadata of the workspace requested
  let matchedWorkspace = _.find(workspaces, function(o) { return `${o.identity.handle}/${o.handle}` == bundle.inputData.workspace_handle; });

  // Create the URL to to perform a query in a user/organization workspace
  const spcUrl = new URL('https://cloud.steampipe.io/');
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
    label: "Find Row via Custom Query",
    description: "Finds a row in a table via a custom query that you provide.",
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
        helpText: 'You should include desired ordering and limiting (usually to 1 record) in the query. **Note**: This query must run in less than 30 seconds.'
      }
    ],
    perform: searchQuery,
    sample: sample,
  },
};
