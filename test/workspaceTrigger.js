"use strict";
const should = require("should");

const zapier = require("zapier-platform-core");

const App = require("../index");
const appTester = zapier.createAppTester(App);

describe("workspace trigger", () => {
  zapier.tools.env.inject();

  it("should get a workspace", (done) => {
    const bundle = {
      authData: {
        token: process.env.TURBOT_PIPES_TOKEN,
        cloud_host: process.env.TURBOT_PIPES_HOST
      },
      inputData: {},
    };
    appTester(App.triggers.workspace.operation.perform, bundle)
      .then((response) => {
        response.should.be.an.instanceOf(Array);
        done();
      })
      .catch(done);
  });
});
