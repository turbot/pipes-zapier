const authentication = {
  type: "custom",
  test: {
    url: "https://cloud.steampipe.io/api/latest/actor",
  },
  fields: [
    {
      key: "token",
      type: "string",
      required: true,
      helpText: "Your Steampipe Cloud [API token](https://steampipe.io/docs/cloud/profile#api-tokens).",
    },
    {
      key: "handle",
      type: "string",
      required: true,
      helpText: "Your Steampipe Cloud [User handle](https://steampipe.io/docs/cloud/profile#updating-your-user-handle).",
    },
    {
      key: "workspace",
      type: "string",
      required: true,
      helpText: "Your Steampipe Cloud [Workspace](https://steampipe.io/docs/cloud/workspaces).",
    },
  ],
  connectionLabel: '{{handle}} - {{workspace}}'
};

module.exports = authentication;
