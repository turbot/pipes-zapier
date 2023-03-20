const sample = require("../samples/sample_user_connection");

const triggerUserConnection = async (z, bundle) => {
  const response = await z.request({
    method: "GET",
    url: `https://cloud.steampipe.io/api/latest/user/${bundle.authData.handle}/conn`,
  });

  const items = z.JSON.parse(response.content)?.items;
  return items.map((obj, i) => {
    return obj
  });
};


module.exports = {
  key: "userConnection",
  noun: "User Connection",

  display: {
    label: "User Connection",
    description: "Triggers when a new user connection is created.",
  },

  operation: {
    inputFields: [
      {
        key: "handle",
        type: "string",
        required: true
      }
    ],
    perform: triggerUserConnection,
    sample: sample,
  },
};
