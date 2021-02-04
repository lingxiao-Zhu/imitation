// 无限次调用
function curry(...args) {
  const values = [args];
  function _curry(...innerArgs) {
    values.push(...innerArgs);
    return _curry;
  }

  _curry.toString = function () {
    return values.reduce((prev, next) => {
      return prev + next;
    }, 0);
  };

  return _curry;
}
