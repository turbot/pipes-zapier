const querySearch = require('./searches/query');
const queryTrigger = require('./triggers/query');
const workspaceTrigger = require('./triggers/workspace');
const authentication = require('./authentication');

const addApiKeyToHeader = (request, z, bundle) => {
  request.headers.Authorization = `Bearer ${bundle.authData.token}`;
  return request;
};

/*
As per https://platform.zapier.com/publish/integration-publishing-guidelines
updated to friendly error messages as opposed to generic API text - if we need to
revert, swap to `response.json.detail`.
*/
const responseHandler = (response, z) => {
  switch (response.status) {
    case 401: // re-authentication required
      throw new z.errors.RefreshAuthError('Authentication required, please ensure your token is valid and set correctly.');
    case 403: // credentials need changing
      throw new z.errors.ExpiredAuthError('Credentials invalid, please regenerate a new token.');
    case 408: // request timed out
    case 504: // gateway timed out
      throw new z.errors.HaltedError('Request exceeded timeout, please update to ensure successful completion.');
    case 500: // general server error
      throw new z.errors.Error(response.json.detail, 'err', response.json.status);
    case 429: // rate limited
      throw new z.errors.ThrottledError('Rate-Limit exceeded, retrying in 60 seconds.', 60);
    default:
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        throw new z.errors.Error(response.json.detail, 'err', response.json.status);
      }
  }
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
    responseHandler
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
