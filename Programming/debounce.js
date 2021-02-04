/**
 * 防抖
 * @param {function} fn
 * @param {number} wait
 */
function debounce(fn, wait = 500) {
  let timer;
  return function anonymous(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, wait);
    }, wait);
  };
}
