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

/**
 * instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。
 * @param {*} object 实例
 * @param {FunctionConstructor} constructor 构造函数
 * @example
 * xxx instanceof Person
 * _instanceof(xxx, Person)
 */
function _instanceof(object, constructor) {
  const helper = function (object) {
    if (constructor[Symbol.hasInstance] && constructor[Symbol.hasInstance](object)) return true;
    if (object.__proto__ === null) return false;
    if (object.__proto__ === constructor.prototype) return true;
    return helper(object.__proto__, constructor.prototype);
  };
  return helper(object);
}

/**
 * typeof 操作符返回一个字符串，表示未经计算的操作数的类型。
 * @param {*} value
 * @returns {string}
 * @example
 * _typeof(1) === 'number'
 */
function _typeof(value) {}
