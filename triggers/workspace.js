const sample = require("../samples/sample_workspace");

// List all the workspaces the user has access to
const fetchActorWorkspaces = async (z, bundle) => {
  const response = await z.request({
    method: "GET",
    url: `https://cloud.steampipe.io/api/latest/actor/workspace`,
  });
  const items = z.JSON.parse(response.content)?.items;

  return items;
};

module.exports = {
  key: 'workspace',
  noun: 'Workspace',

  display: {
    label: 'Workspace',
    description: 'Fetch all the workspaces the user has access to.',
    hidden: true
  },

  operation: {
    perform: fetchActorWorkspaces,
    sample: sample
  }
}