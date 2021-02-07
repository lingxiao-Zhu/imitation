/**
 * 对象浅拷贝
 * @param {object} obj
 */
function shadowClone(obj) {
  if (typeof obj !== 'object') return obj;
  const newObj = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

/**
 * 对象深拷贝
 * @param {object} obj
 */
function deepClone(obj, cacheMap = new Map()) {
  if (!(obj instanceof Object)) return obj;

  const StringType = '[object String]';
  const NumberType = '[object Number]';
  const ArrayType = '[object Array]';
  const ObjectType = '[object Object]';
  const DateType = '[object Date]';
  const RegexpType = '[object Regexp]';
  const FunctionType = '[object Function]';
  const MapType = '[object Map]';
  const SetType = '[object Set]';

  // 避免循环引用
  if (cacheMap.has(obj)) return obj;
  cacheMap.set(obj, 1);

  const { constructor } = obj;

  const newObj = Array.isArray(obj) ? [] : {};

  const _innerDeepClone = (childObj) => {
    return deepClone(childObj, cacheMap);
  };

  switch (Object.prototype.toString.call(obj)) {
    case StringType:
    case NumberType:
    case RegexpType:
    case DateType:
      return new constructor(obj);
    case ArrayType:
    case ObjectType:
      const newObj = new constructor();
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = _innerDeepClone(obj[key]);
        }
      }
      return newObj;
    case MapType:
      const newMap = new Map();
      for (const [key, value] of obj) {
        newMap.set(key, _innerDeepClone(value));
      }
      return newMap;
    case SetType:
      const newSet = new Set();
      for (const val of Set) {
        newSet.add(_innerDeepClone(val));
      }
      return newSet;
    case FunctionType:
      return function (...args) {
        obj.apply(this, args);
      };
  }

  return newObj;
}
