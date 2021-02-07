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
