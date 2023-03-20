"use strict";
const should = require("should");

const zapier = require("zapier-platform-core");

const App = require("../index");
const appTester = zapier.createAppTester(App);

describe("organization workspace trigger", () => {
  zapier.tools.env.inject();

  it("should get a workspace", (done) => {
    const bundle = {
      authData: {
        token: process.env.STEAMPIPE_CLOUD_TOKEN,
      },
      inputData: {
        organization: process.env.STEAMPIPE_ORG_HANDLE,
      },
    };
    appTester(App.triggers.orgWorkspace.operation.perform, bundle)
      .then((response) => {
        response.should.be.an.instanceOf(Array);
        done();
      })
      .catch(done);
  });
});
