const _ = require("lodash");
const sample = require("../samples/sample_query");

const triggerQuery = async (z, bundle) => {

  // List all the workspaces the actor has access to
  const listWorkspacesResponse = await z.request({
    method: "GET",
    url: `https://cloud.steampipe.io/api/latest/actor/workspace`,
  });
  const workspaces = z.JSON.parse(listWorkspacesResponse.content)?.items;

  // Get the metadata of the workspace requested
  let workspaceHandle = bundle.inputData.workspace_handle
  let workspace = _.find(workspaces, function(o) { return o.handle == workspaceHandle; });
  z.console.log('Workspace info: ', workspace)

  // Create the URL to to perform a query in a user/organization workspace
  const spcUrl = new URL('https://cloud.steampipe.io/');
  spcUrl.pathname = `api/latest/${workspace.identity.type}/${workspace.identity.handle}/workspace/${bundle.inputData.workspace_handle}/query`;

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
    description: "Triggers when a SQL query finds unique records.",
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
        helpText: 'Your SQL query',
      }
    ],
    perform: triggerQuery,
    sample: sample,
  },
};
