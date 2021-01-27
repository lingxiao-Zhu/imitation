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
 * 把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。
 * @param {Function} fn
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
  const innerFunc = function (...args) {
    allArgs.push(...args);
    if (allArgs.length < len) return innerFunc;
    return fn.apply(this, allArgs);
  };
  return innerFunc;
}

/**
 * 惰性函数
 */
function lazyFunc() {
  const val = Date.now();
  lazyFunc = () => val;
  return lazyFunc();
}

/**
 * 防抖
 * @param {Function} fn
 * @param {Number} timeout
 * @returns {Function}
 */
function debounce(fn, timeout) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(fn.bind(this), timeout, args);
  };
}

/**
 * 节流
 * @param {Function} fn
 * @param {Number} timeout
 * @returns {Function}
 */
function throttle(fn, timeout) {
  let previous = 0;
  let timer = null;
  return function (...args) {
    const period = Date.now() - previous;
    if (period > timeout) {
      // 超出等待时间
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      previous = Date.now();
      fn.apply(this, args);
    } else {
      // 在等待时间内
      if (!timer) {
        const remaining = timeout - period;
        timer = setTimeout(() => {
          previous = Date.now();
          timer = null;
          fn.apply(this, args);
        }, remaining);
      }
    }
  };
}

/**
 * 数组去重
 * @param {Array} arr
 */
function flatten(arr) {
  // return Array.from(new Set(arr));
  const map = {};
  return arr.filter((item) => {
    if (map.hasOwnProperty(typeof item + JSON.stringify(item))) {
      return false;
    } else {
      map[typeof item + JSON.stringify(item)] = 1;
      return true;
    }
  });
}

/**
 * 深度优先遍历
 * @param {HTMLElement} root
 */
function traverseByDFS(root) {
  if (root.childNodes.length < 1) return;
  root.childNodes.forEach(traverseByDFS);
}

/**
 * 广度优先遍历
 * @param {HTMLElement} root
 */
function traverseByBFS() {}

/**
 * @version 1.3
 * @param {*} context
 * @param  {...any} outerArgs
 */
Function.prototype.bind = function (context, ...outerArgs) {
  if (typeof this !== 'function') {
    throw new Error('Function.prototype.bind must be called by function');
  }
  const self = this;
  const fBound = function () {
    self.apply(this instanceof fBound ? this : context, [...outerArgs, ...innerArgs]);
  };
  fBound.prototype = Object.create(this.prototype);
  return fBound;
};

/**
 * 浅拷贝
 * @param {*} obj
 */
function shadowClone(obj) {}

/**
 * 深拷贝
 * @param {*} obj
 */
function deepClone(obj, cacheMap = new WeakMap()) {
  const FunctionType = '[object Function]';
  const BooleanType = '[object Boolean]';
  const NumberType = '[object Number]';
  const StringType = '[object String]';
  const SymbolType = '[object Symbol]'; // 包装类，Object(Symbol(1))
  const RegExpType = '[object RegExp]';
  const ObjectType = '[object Object]';
  const ArrayType = '[object Array]';
  const DateType = '[object Date]';
  const SetType = '[object Set]';
  const MapType = '[object Map]';

  // 基础类型直接返回
  if (!obj instanceof Object) return obj;

  // 避免循环引用
  if (cacheMap.get(obj)) return obj;
  cacheMap.set(obj, 1);

  const Factory = obj.constructor;

  switch (Object.prototype.toString.call(obj)) {
    case StringType:
    case NumberType:
    case BooleanType:
    case DateType:
      return new Factory(obj);
    case SetType:
      const newSet = new Set();
      for (const val of obj) {
        newSet.add(deepClone(val));
      }
      return newSet;
    case MapType:
      const newMap = new Map();
      for (const [key, value] of obj) {
        newMap.set(key, deepClone(val));
      }
      return newMap;
    case RegExpType:
      return new Factory(obj.source, obj.flags);
    case SymbolType:
      return Object(obj.valueOf());
    case ObjectType:
    case ArrayType:
      const newObj = new Factory();
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = deepClone(obj[key]);
        }
      }
      return newObj;
    case FunctionType:
      return function (...args) {
        return obj.apply(this, args);
      };
  }
}

/**
 * 构造并返回一个新字符串，该字符串包含被连接在一起的指定数量的字符串的副本。
 * @param {number} count
 */
String.prototype.repeat = function (count) {};

/**
 * 按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。
 * @param {number} deep
 */
Array.prototype.flat = function (deep) {};

/**
 * 异步并发数限制
 */
function limit(count, array, iterateFunc) {}

/**
 * 观察者模式
 */
class EventEmitter {}

/**
 * call方法
 * @param {*} thisArg
 * @param  {...any} args
 */
Function.prototype.call = function (thisArg, ...args) {};
