/**
 *
 * @param {*} obj 对象
 * @param {*} constructor 构造函数
 */
function _instanceof(obj, constructor) {
  if (!obj.__proto__) return false;
  if (constructor[Symbol.hasInstance] && constructor[Symbol.hasInstance](obj)) return true;
  if (obj.__proto__ === constructor.prototype) return true;
  return _instanceof(obj.__proto__, constructor);
}
