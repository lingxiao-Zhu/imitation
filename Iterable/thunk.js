const path = require('path');
const fs = require('fs');

function Thunk(fn) {
  return function () {
    const args = Array.prototype.slice.call(arguments);
    return function (callback) {
      args.push(callback);
      return fn.apply(this, args);
    };
  };
}

const readFileThunk = Thunk(fs.readFile, {
  encoding: 'utf-8',
});

/**
 * 当必须保证前一步执行完，才能执行后一步，这时，Thunk 函数就能派上用处。
 * 以读取文件为例。
 * 下面的 Generator 函数封装了两个异步操作。
 */
function* gen() {
  const r1 = yield readFileThunk(path.join(__dirname, './index.js'));
  console.log(r1.toString());
  const r2 = yield readFileThunk(path.join(__dirname, './index.js'));
  console.log(r2.toString());
}

/**
 * 手动执行上面这个 Generator 函数。
 * 调用next返回的value
 */
const g = gen();
g.next().value((err, data) => {
  if (err) throw err;
  const r2 = g.next(data);
  r2.value((err, data) => {
    g.next(data);
  });
});

/**
 * 自动执行
 * @param {Generator} gen
 */
function run(gen) {
  const fn = gen();
  function next(err, data) {
    const result = fn.next(data);
    if (result.done) return;
    result.value(next);
  }
  next();
}

run(gen);
