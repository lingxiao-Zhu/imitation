// 实现带并发限制的异步调度器Scheduler，保证同时运行的任务最多有两个。

class Scheduler {
  constructor(max = 2) {
    this.max = max;
    this.run = 0;
    this.tasks = [];
  }

  addTask(fn) {
    this.tasks.push(fn);
  }

  start() {
    while (this.run < this.max) {
      this.run++;
      const task = this.tasks.shift();
      task().then(() => {
        this.run--;
        this.start();
      });
    }
  }
}

/**
 * 要求最大并发数 maxNum
 * 每当有一个请求返回，就留下一个空位，可以增加新的请求
 * 所有请求完成后，结果按照 urls 里面的顺序依次打出
 * @param {Array<string>} urls
 * @param {number} maxNum
 */
function multiRequest(urls, maxNum) {
  const res = [];
  let i = 0; // urls下标
  let resolve;
  // 一直pending，等到所有url完成再resolve，保证promise.all最后执行
  let promise = new Promise((r) => (resolve = r));

  const request = (url) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(url);
      }, 2000);
    });
  };

  const start = () => {
    if (!urls[i]) return resolve();
    console.log('start fetch:', urls[i]);
    const task = request(urls[i++]).finally(() => {
      start();
    });
    res.push(task);
  };

  while (i < maxNum) {
    start();
  }

  return promise.then(() => Promise.all(res));
}

multiRequest([1, 2, 3, 4, 5, 6], 2).then((res) => console.log(res));
