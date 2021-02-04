/**
 * 柯里化，通过fn.number判断参数数量
 * @param {function} fn
 * @example
 * function add(x,y,z){ return x+y+z }
 * const curAdd = curry(add);
 * curAdd(1,2,3)   === 6
 * curAdd(1)(2)(3) === 6
 * curAdd(1,2)(3)  === 6
 */
function curry(fn) {
  const len = fn.length;
  const allArgs = [];
  const _innerFunc = (...args) => {
    allArgs.push(...args);
    if (allArgs.length >= len) {
      return fn.apply(null, allArgs);
    }
    return _innerFunc;
  };
  return _innerFunc;
}
