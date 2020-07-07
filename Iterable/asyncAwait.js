// ES2017 标准引入了 async 函数，使得异步操作变得更加方便。
// async 函数是什么？一句话，它就是 Generator 函数的语法糖。

const fs = require('fs');
const path = require('path');

const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function (error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};

// 前文有一个 Generator 函数，依次读取两个文件。
const gen = function* () {
  const f1 = yield readFile(path.join(__dirname, './index.js'));
  const f2 = yield readFile(path.join(__dirname, './index.js'));
  console.log(f1.toString());
  console.log(f2.toString());
};

// 上面代码的函数gen可以写成async函数，就是下面这样。
const asyncReadFile = async function () {
  const f1 = await readFile(path.join(__dirname, './index.js'));
  const f2 = await readFile(path.join(__dirname, './index.js'));
  console.log(f1.toString());
  console.log(f2.toString());
};

/**
 * async函数对 Generator 函数的改进，体现在以下四点。
 * 1. 内置执行器。Generator 函数的执行必须靠执行器，所以才有了co模块，而async函数自带执行器。
 * 2. 更好的语义。
 * 3. 更广的适用性。co约定，yield后面只能跟 Thunk 函数或 Promise 对象，而 async 函数的 await后面，
 * 可以是 Promise 对象和原始类型的值
 */

// async 函数的实现原理就是把 Generator 函数和自动执行器，包装在一个函数里。
async function fn(args) {
  // ...
}

// 等同于

function fn(args) {
  return spawn(function* () {
    // ...
  });
}

/**
 *
 * @param {Generator} genF
 */
function spawn(genF) {
  return new Promise((resolve, reject) => {
    const gen = genF();
    (function next(val) {
      const { done, value } = gen.next(val);
      if (done) return resolve(value);
      value.then(next, reject);
    })(undefined);
  });
}

spawn(gen);
