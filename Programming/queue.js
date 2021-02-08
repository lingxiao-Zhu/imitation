/**
 * @example
 * new Queue()
 *  .task(1000, () => {
 *   console.log(1)
 *  })
 *  .task(2000, () => {
 *   console.log(2)
 *  })
 *  .task(1000, () => {
 *   console.log(3)
 *  })
 *  .start()
 */
class Queue {
  constructor() {
    this.pending = [];
  }

  task(time, fn) {
    this.pending.push(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            fn();
            resolve();
          }, time);
        }),
    );
    return this;
  }

  async start1() {
    for (const task of this.pending) {
      await task();
    }
  }

  async start2() {
    let res = Promise.resolve();
    for (const task of this.pending) {
      res = res.then(() => task());
    }
  }
}
