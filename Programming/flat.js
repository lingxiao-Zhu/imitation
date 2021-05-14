// 递归
Array.prototype.flat1 = function (depth = 1) {
  if (depth < 1) return this;
  const flatten = [];
  this.forEach((val) => {
    if (Array.isArray(val)) {
      flatten.push(...val.flat1(depth - 1));
    } else {
      flatten.push(val);
    }
  });
  return flatten;
};

// ⽣成器 Generator
// yield*:委托给另一位可迭代对象，不仅能作用于生成器，还可以用于其他任意可迭代对象
Array.prototype.flat2 = function* () {
  for (const item of this) {
    if (Array.isArray(item)) {
      yield* item.flat2();
    } else {
      yield item;
    }
  }
};

/**
 * 如果数组里全是数字
 * @param {Array<number>} arr
 * @returns
 */
function flat3(arr) {
  return arr
    .toString()
    .split(',')
    .map((str) => +str);
}

/**
 * 通过reduce
 * @param {Array<any>} arr
 */
function flat4(arr) {
  return arr.reduce((prev, next) => {
    return prev.concat(Array.isArray(next) ? flat4(next) : next);
  }, []);
}
