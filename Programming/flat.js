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

// 迭代器 Iterator
Array.prototype.flat2 = function (depth = 1) {};

// ⽣成器 Generator
Array.prototype.flat3 = function (depth = 1) {};
