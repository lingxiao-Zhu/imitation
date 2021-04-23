/**
 *  找出数组中出现大于 times 次数的数
 * @param {number} times
 */
Array.prototype.findDuplicate = function (times) {
  if (!Array.isArray(this)) {
    throw TypeError('findDuplicate must be used for array');
  }

  const obj = {};
  const res = [];

  for (let i of this) {
    obj[i] = (obj[i] || 0) + 1;
    if (obj[i] === times) {
      res.push(i);
    }
  }
  return res;
};

console.log([1, 2, 3, 4, 1, 2, 2, 2].findDuplicate(2));
