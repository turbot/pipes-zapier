const authentication = {
  type: "custom",
  test: {
    url: "https://pipes.turbot.com/api/latest/actor",
  },
  fields: [
    {
      key: 'token',
      type: 'string',
      required: true,
      label: 'Token',
      helpText: 'Your Turbot Pipes [API token](https://turbot.com/pipes/docs/profile#tokens).',
    },
    {
      key: "cloud_host",
      type: "string",
      required: false,
      label: 'Cloud Host',
      default: 'https://pipes.turbot.com',
      helpText: "Your Turbot Pipes Host.",
    }
  ],
  connectionLabel: '{{display_name}} - {{handle}}'
};

module.exports = authentication;
