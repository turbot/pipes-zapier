const triggerQuery = async (z, bundle) => {

  const spcUrl = new URL('https://cloud.steampipe.io/');
  spcUrl.pathname = `api/latest/user/${bundle.authData.handle}/workspace/${bundle.authData.workspace}/query`;

  spcUrl.searchParams.append("sql", bundle.inputData.query)
  const response = await z.request({
    method: "POST",
    url: spcUrl.href,
  });

  const items = z.JSON.parse(response.content)?.items;

  if (items == null) {
    z.console.log('Got Empty Response')
    return [];
  }

  z.console.log('Response size: ', items.length)
  return items.map((obj, i) => {
    if (obj.id != null) {
      return obj;
    }

    let hash = z.hash('md5', z.JSON.stringify(obj))
    return {
      ...obj,
      id: hash,
    };
  });
};

module.exports = {
  triggerQuery
}