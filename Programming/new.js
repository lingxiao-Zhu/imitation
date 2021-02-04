function _new(constructor, ...args) {
  if (typeof constructor !== 'function') {
    throw new Error('new must be called by function');
  }
  // arrow function
  if (!constructor.prototype) {
    throw new Error(constructor.name + 'is not a constructor');
  }
  const obj = {};
  const res = constructor.apply(obj, args);
  obj.__proto__ = constructor.prototype;
  // 如果构造函数返回了对象，就返回对象
  return typeof res === 'object' ? res : obj;
}
