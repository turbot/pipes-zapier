const authentication = {
  type: "custom",
  test: {
    url: "https://cloud.steampipe.io/api/latest/actor",
  },
  fields: [
    {
      key: 'token',
      type: 'string',
      required: true,
      label: 'Token',
      helpText: 'Your Steampipe Cloud [API token](https://steampipe.io/docs/cloud/profile#tokens).',
    },
    {
      key: "cloud_host",
      type: "string",
      required: false,
      label: 'Cloud Host',
      default: 'cloud.steampipe.io',
      helpText: "Your Steampipe Cloud [Host](https://steampipe.io/docs/reference/env-vars/steampipe_cloud_host).",
    }
  ],
  connectionLabel: '{{display_name}} - {{handle}}'
};

module.exports = authentication;
