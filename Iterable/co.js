const path = require('path');
const fs = require('fs');
const isPromise = (value) => value && typeof value !== 'function' && typeof value.then === 'function';
// 首先，把fs模块的readFile方法包装成一个 Promise 对象。
const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function (error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};

function* gen() {
  const r1 = yield readFile(path.join(__dirname, './index.js'));
  const r2 = yield readFile(path.join(__dirname, './index.js'));
  console.log(r1.toString());
  console.log(r2.toString());
}

// 手动执行上面的 Generator 函数
const g = gen();
g.next().value.then((data) => {
  g.next(data).value.then((data) => {
    g.next(data);
  });
});

/**
 * co 模块其实就是将两种自动执行器（Thunk 函数和 Promise 对象），包装成一个模块。
 * 使用 co 的前提条件是，Generator 函数的yield命令后面，只能是 Thunk 函数或 Promise 对象。
 * 如果数组或对象的成员，全部都是 Promise 对象，也可以使用 co，详见后文的例子。
 * @param {Generator} gen
 * @returns {Promise}
 */
function co(gen) {
  return new Promise((resolve, reject) => {
    if (typeof gen === 'function') gen = gen();
    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    try {
      (function next(val) {
        const { done, value } = gen.next(val);
        if (done) return resolve(value);
        if (isPromise(value)) return value.then(next);
        return next(value);
      })(null);
    } catch (e) {
      reject(e);
    }
  });
}

co(gen);
