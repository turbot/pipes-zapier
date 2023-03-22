"use strict";
const should = require("should");

const zapier = require("zapier-platform-core");

const App = require("../index");
const appTester = zapier.createAppTester(App);

describe("query search", () => {
  zapier.tools.env.inject();

  it("should find a record", (done) => {
    const bundle = {
      authData: {
        token: process.env.STEAMPIPE_CLOUD_TOKEN
      },
      inputData: {
        workspace_handle: process.env.STEAMPIPE_WORKSPACE,
        query: "select arn, name from aws_s3_bucket where name = 'abhi-demo-bucket-04112019';"
      },
    };
    appTester(App.triggers.query.operation.perform, bundle)
      .then((response) => {
        response.should.be.an.instanceOf(Array);
        done();
      })
      .catch(done);
  });
});
