const sample = require("../samples/sample_org_workspace");

const triggerOrgWorkspace = async (z, bundle) => {
  const response = await z.request({
    method: "GET",
    url: `https://cloud.steampipe.io/api/latest/org/${bundle.inputData.organization}/workspace`,
  });

  const items = z.JSON.parse(response.content)?.items;
  return items.map((obj, i) => {
    return obj
  });
};


module.exports = {
  key: "orgWorkspace",
  noun: "Org Workspace",

  display: {
    label: "Organization Workspace",
    description: "Triggers when a new organization workspace is created.",
  },

  operation: {
    inputFields: [
      {
        key: "organization",
        type: "string",
        required: true
      }
    ],
    perform: triggerOrgWorkspace,
    sample: sample,
  },
};
