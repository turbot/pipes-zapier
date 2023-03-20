const sample = require("../samples/sample_query");
const trigger = require("./trigger");

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
    perform: trigger.triggerQuery,
    sample: sample,
  },
};
