const querySearch = require('./searches/query');
const queryTrigger = require('./triggers/query');
const workspaceTrigger = require('./triggers/workspace');
const authentication = require('./authentication');

const addApiKeyToHeader = (request, z, bundle) => {
  request.headers.Authorization = `Bearer ${bundle.authData.token}`;
  return request;
};

const handleHTTPError = (response, z) => {

  if (response.status === 401) {
    throw new z.errors.RefreshAuthError(response.json.detail, response.json.status);
  }
  if (response.status === 403) {
    throw new z.errors.HaltedError(response.json.detail, response.json.status);
  }
  else if (response.status === 429) {
    throw new ThrottledError(response.json.detail, 600);
  }
  else if (response.status === 500) {
    throw new z.errors.HaltedError(response.json.detail, response.json.status);
  }
  else if (response.status === 504) {
    throw new z.errors.Error(response.json.detail, response.json.status);
  }
  else if (response.status >= 400) {
    throw new z.errors.Error(response.json.detail, response.json.status);
  }
  return response;
};

const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,

  // beforeRequest & afterResponse are optional hooks into the provided HTTP client
  beforeRequest: [
    addApiKeyToHeader
  ],

  afterResponse: [
    handleHTTPError
  ],

  // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
  resources: {
  },

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [queryTrigger.key]: queryTrigger,
    [workspaceTrigger.key]: workspaceTrigger,
  },

  // If you want your searches to show up, you better include it here!
  searches: {
    [querySearch.key]: querySearch,
  },

  // If you want your creates to show up, you better include it here!
  creates: {
  }
};

// Finally, export the app.
module.exports = App;
