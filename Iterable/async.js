// ES2017 标准引入了 async 函数，使得异步操作变得更加方便。
// async 函数是什么？一句话，它就是 Generator 函数的语法糖。
async function fn() {
  // ...
}

// 等同于

function fn() {
  return spawn(function* () {
    return new Promise((resolve, reject) => {
      const gen = genF();
    });
  });
}

fn();
