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
