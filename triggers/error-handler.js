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
  else if (response.status >= 400) {
    throw new z.errors.Error(response.json.detail, response.json.status);
  }
  return response;
};

module.exports = {
  handleHTTPError
}