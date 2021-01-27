/**
 * new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象类型之一。
 * @param {FunctionConstructor} constructor 构造函数
 * @param  {...any} args 参数
 * @example
 * var p = objectFactory(Person, ...)
 * var p = new Person(...)
 */
function _new(constructor, ...args) {
  const obj = {};
  const val = constructor.apply(obj, args);
  obj.__proto__ = constructor.prototype;
  // 断返回的值是不是一个对象，如果是一个对象，我们就返回这个对象，如果没有，我们该返回什么就返回什么
  return typeof val === 'object' ? val : obj;
}
