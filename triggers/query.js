const sample = require("../samples/sample_query");

const triggerQuery = async (z, bundle) => {

  const spcUrl = new URL('https://cloud.steampipe.io/');
  spcUrl.pathname = `api/latest/user/${bundle.authData.handle}/workspace/${bundle.authData.workspace}/query`;

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
        key: "query",
        type: "string",
        required: true,
        placeholder: "select * from cloud;",
        helpText: "Your SQL query",
      }
    ],
    perform: triggerQuery,
    sample: sample,
  },
};
