/**
 * 验证http链接是否有效
 * @param {string} url
 */
function validateHttpUrl(url) {
  const reg = /^http(s)?:\/\/([a-z0-9]+\.){1,2}[a-z]{2,4}(:\d{2,5})(\/[\w/\.]+)*(\?(\w+=\w+\&)*)?(#\w*)?$/;
  return reg.test(url);
}

/**
 * 提取query
 * @param {string} query ?age=1&name=2
 */
function parseQuery(query) {
  const obj = {};
  query = query.trim().replace(/^[?#&]/, '');
  for (const pair of query.split('&')) {
    const [key, value] = pair.split('=');
    obj[key] = value;
  }
  return obj;
}
