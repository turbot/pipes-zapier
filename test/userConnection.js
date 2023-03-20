"use strict";
const should = require("should");

const zapier = require("zapier-platform-core");

const App = require("../index");
const appTester = zapier.createAppTester(App);

describe("user connection trigger", () => {
  zapier.tools.env.inject();

  it("should get a connection", (done) => {
    const bundle = {
      authData: {
        token: process.env.STEAMPIPE_CLOUD_TOKEN,
        handle: process.env.STEAMPIPE_USER_HANDLE,
      },
      inputData: {},
    };
    appTester(App.triggers.userConnection.operation.perform, bundle)
      .then((response) => {
        response.should.be.an.instanceOf(Array);
        done();
      })
      .catch(done);
  });
});
