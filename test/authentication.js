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
        token: process.env.TURBOT_PIPES_TOKEN,
        cloud_host: process.env.TURBOT_PIPES_HOST
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
