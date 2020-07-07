// 异步遍历器

// 1.同步遍历器
function idMaker() {
  let index = 0;

  return {
    next: function () {
      return { value: index++, done: false };
    },
  };
}

const it = idMaker();

it.next().value; // 0
it.next().value; // 1
it.next().value; // 2

// 2.异步遍历器
function idMakerAsync() {
  let index = 0;

  return {
    next: function () {
      return new Promise(function (resolve, reject) {
        setTimeout(() => {
          resolve({ value: index++, done: false });
        }, 1000);
      });
    },
  };
}

const itAsync = idMakerAsync();

itAsync.next().then(console.log);
itAsync.next().then(console.log);
itAsync.next().then(console.log);

(async function f() {
  console.log(await itAsync.next());
  console.log(await itAsync.next());
  console.log(await itAsync.next());
})();

(async () => {
  for await (const x of itAsync) {
    console.log(x);
  }
})();

/**
 * ES2018 引入了“异步遍历器”（Async Iterator），为异步操作提供原生的遍历器接口，即value和done这两个属性都是异步产生。
 */

var asyncIterable = {
  [Symbol.asyncIterator]() {
    return {
      i: 0,
      next() {
        if (this.i < 3) {
          return Promise.resolve({ value: this.i++, done: false });
        }

        return Promise.resolve({ done: true });
      },
    };
  },
};

(async function () {
  for await (num of asyncIterable) {
    console.log(num);
  }
})();
