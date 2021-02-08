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
