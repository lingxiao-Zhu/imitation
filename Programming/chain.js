/**
 * @example
 * const chain = new Chain();
 * chain.eat().sleep(5).eat().sleep(6).work()
 */
class Chain {
  constructor() {
    this.isSleeping = Promise.resolve();
  }

  sleep(seconds) {
    this.isSleeping = this.isSleeping.then(() => {
      return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
      });
    });
    return this;
  }

  eat() {
    this.isSleeping.then(() => {
      console.log('eat');
    });
    return this;
  }

  work() {
    this.isSleeping.then(() => {
      console.log('work');
    });
    return this;
  }
}
