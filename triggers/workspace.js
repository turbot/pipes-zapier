const sample = require("../samples/sample_workspace");
const URL = require('url').URL

// List all the workspaces the user has access to
const fetchActorWorkspaces = async (z, bundle) => {
  const spcUrl = new URL(bundle.authData.cloud_host);
  spcUrl.pathname = "api/latest/actor/workspace"

  const response = await z.request({
    method: "GET",
    url: spcUrl.href,
  });

  const items = z.JSON.parse(response.content)?.items;
  return items.map((obj, i) => {
    obj.name = `${obj.identity.handle}/${obj.handle}`
    return obj
  });
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