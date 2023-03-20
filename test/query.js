"use strict";
const should = require("should");

const zapier = require("zapier-platform-core");

const App = require("../index");
const appTester = zapier.createAppTester(App);

describe("query trigger", () => {
  zapier.tools.env.inject();

  it("should get a query", (done) => {
    const bundle = {
      authData: {
        token: process.env.STEAMPIPE_CLOUD_TOKEN,
        handle: process.env.STEAMPIPE_USER_HANDLE,
        workspace: process.env.STEAMPIPE_WORKSPACE
      },
      inputData: {
        query: "select arn, name from aws_s3_bucket limit 2;"
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
