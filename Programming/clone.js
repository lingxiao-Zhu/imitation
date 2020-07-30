/**
 * 浅拷贝:
 * 创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。
 * 如果属性是基本类型，拷贝的就是基本类型的值，
 * 如果属性是引用类型，拷贝的就是内存地址，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。
 * @param {Record<any, any>} origin
 */
function shadowClone(origin) {
  const clone = origin instanceof Array ? [] : {};
  for (let key in origin) {
    if (origin.hasOwnProperty(key)) {
      clone[key] = origin[key];
    }
  }
  return clone;
}

/**
 * 深拷贝：
 * 将一个对象从内存中完整的拷贝一份出来,从堆内存中开辟一个新的区域存放新对象,且修改新对象不会影响原对象
 * @param {Object} origin
 */

// 可遍历引用类型
const mapTag = '[object Map]';
const setTag = '[object Set]';
const arrayTag = '[object Array]';
const objectTag = '[object object]';

// 不可遍历引用类型
const boolTag = '[object Boolean]';
const dateTag = '[object Date]';
const errorTag = '[object Error]';
const numberTag = '[object Number]';
const regexpTag = '[object RegExp]';
const stringTag = '[object String]';
const symbolTag = '[object Symbol]';
const functionTag = '[object Function]';

function deepClone(origin, cacheMap = new WeakMap()) {
  // 克隆原始类型
  if (typeof origin !== 'object') return origin;

  const type = Object.prototype.toString.call(origin);

  // 获取oirgin构造函数
  const ctor = origin.constructor;
  const clone = new ctor();

  // 防止循环引用
  if (cacheMap.get(origin)) return cacheMap.get(origin);
  cacheMap.set(origin, clone);

  // 克隆set
  if (type === setTag) {
    origin.forEach((value) => {
      clone.add(deepClone(value, cacheMap));
    });
  }

  // 克隆map
  if (type === mapTag) {
    origin.forEach((value, key) => {
      clone.set(key, deepClone(value, cacheMap));
    });
  }

  // 克隆对象和数组
  if (type === objectTag || type === arrayTag) {
    for (let i in origin) {
      clone[i] = deepClone(origin[i], map);
    }
  }

  // 克隆不可遍历对象
  switch (type) {
    case boolTag:
    case numberTag:
    case stringTag:
    case errorTag:
    case dateTag:
      return new ctor(origin);
    case regexpTag:
      const reFlags = /\w*$/;
      const result = new targe.constructor(targe.source, reFlags.exec(targe));
      result.lastIndex = targe.lastIndex;
      return result;
    case symbolTag:
      return Object(Symbol.prototype.valueOf.call(origin));
    case functionTag:
      return cloneFunction(origin);
  }

  return clone;
}

/**
 * 克隆函数，需要区分箭头函数和普通函数
 * @param {*} origin
 */
function cloneFunction(func) {
  const bodyReg = /(?<={)(.|\n)+(?=})/m;
  const paramReg = /(?<=\().+(?=\)\s+{)/;
  const funcString = func.toString();
  if (func.prototype) {
    console.log('普通函数');
    const param = paramReg.exec(funcString);
    const body = bodyReg.exec(funcString);
    if (body) {
      console.log('匹配到函数体：', body[0]);
      if (param) {
        const paramArr = param[0].split(',');
        console.log('匹配到参数：', paramArr);
        return new Function(...paramArr, body[0]);
      } else {
        return new Function(body[0]);
      }
    } else {
      return null;
    }
  } else {
    return eval(funcString);
  }
}
