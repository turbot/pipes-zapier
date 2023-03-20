"use strict";
const should = require("should");
const zapier = require("zapier-platform-core");
const App = require("../index");
const appTester = zapier.createAppTester(App);

describe("basic authentication", () => {
  zapier.tools.env.inject();

  it("should authenticate", (done) => {
    const bundle = {
      authData: {
        token: process.env.STEAMPIPE_CLOUD_TOKEN,
        handle: process.env.STEAMPIPE_USER_HANDLE,
        workspace: process.env.STEAMPIPE_WORKSPACE
      },
    };

    appTester(App.authentication.test, bundle)
      .then((response) => {
        should.exist(response.handle);
        done();
      })
      .catch(done);
  });
});
