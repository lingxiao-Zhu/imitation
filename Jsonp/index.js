/**
 * jsonp
 * @param {*} param0
 */
function jsonp({ url, data, callback }) {
  const container = document.querySelector('head');
  const fnName = `json_p${Date.now()}`;
  const script = document.createElement('script');
  script.src = `${url}?${objectToQuery(data)}&callback=${fnName}`;
  script.type = 'application/javascript';
  container.appendChild(script);

  window[fnName] = function (res) {
    callback && callback(res);
    container.removeChild(script);
    delete window[fnName];
  };

  // 错误处理
  script.onerror = function () {
    callback && callback('something error hanppend!');
    container.removeChild(script);
    delete window[fnName];
  };
}

/**
 *
 * @param {object} data
 * @returns
 */
function objectToQuery(data) {
  const arr = [];
  for (let i in data) {
    arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
  }
  return arr.join('&');
}
