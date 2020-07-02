const isMyPromise = (target) => target instanceof MyPromise;
const isFunction = (fn) => Object.prototype.toString.call(fn) === '[object Function]';
const isLength = (value) => typeof value == 'number' && value > -1 && value % 1 == 0;
const isArrayLike = (value) => value != null && isLength(value.length) && !isFunction(value);

// 定义 Promise 的三种状态
const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

// Promise是一种Monad实现
function MyPromise(executor) {
  if (!isFunction(executor)) {
    throw new Error('MyPromise must accept a function as a parameter');
  }
  this._status = PENDING;
  this._value = undefined;
  this._reason = undefined;
  // 添加成功回调函数队列
  this._fulfilledQueues = [];
  // 添加失败回调函数队列
  this._rejectedQueues = [];

  try {
    executor(this._resolve.bind(this), this._reject.bind(this));
  } catch (e) {
    this._reject(e);
  }
}

MyPromise.prototype._resolve = function (value) {
  if (this._status !== PENDING) return;
  this._status = FULFILLED;
  this._value = value;
  // 模拟异步
  setTimeout(() => {
    let cb;
    while ((cb = this._fulfilledQueues.shift())) {
      cb(value);
    }
  }, 0);
};

MyPromise.prototype._reject = function (reason) {
  if (this._status !== PENDING) return;
  this._status = REJECTED;
  this._reason = reason;
  setTimeout(() => {
    let cb;
    while ((cb = this._rejectedQueues.shift())) {
      cb(reason);
    }
  }, 0);
};

/**
 * 返回一个新的 promise 对象
 * @param {*} onFulfilled
 * @param {*} onRejected
 * @returns {MyPromise}
 */
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  return new MyPromise((resolve, reject) => {
    // 成功时执行的函数
    const fulfilledHandler = (value) => {
      try {
        if (isFunction(onFulfilled)) {
          const res = onFulfilled(value);
          if (isMyPromise(res)) {
            // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
            res.then(resolve, reject);
          } else {
            //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
            resolve(res);
          }
        } else {
          // If onFulfilled is not a function and promise1 is fulfilled, promise2 must be fulfilled with the same value as promise1.
          resolve(value);
        }
      } catch (err) {
        // 如果函数执行出错，新的Promise对象的状态为失败
        reject(err);
      }
    };

    // 失败时执行的函数，实现上同成功时执行的函数
    const rejectedHandler = (reason) => {
      try {
        if (isFunction(onRejected)) {
          const res = onRejected(reason);
          if (isMyPromise(res)) {
            res.then(resolve, reject);
          } else {
            // If either onFulfilled or onRejected returns a value x, run the Promise Resolution Procedure [[Resolve]](promise2, x).
            resolve(reason);
          }
        } else {
          // If onRejected is not a function and promise1 is rejected, promise2 must be rejected with the same reason as promise1.
          reject(reason);
        }
      } catch (err) {
        reject(err);
      }
    };

    switch (this._status) {
      // 当状态为pending时，将then方法回调函数加入执行队列等待执行
      case PENDING:
        this._fulfilledQueues.push(fulfilledHandler);
        this._rejectedQueues.push(rejectedHandler);
        break;
      // 当状态已经改变时，立即执行对应的回调函数
      case FULFILLED:
        fulfilledHandler(this._value);
        break;
      case REJECTED:
        rejectedHandler(this._reason);
        break;
    }
  });
};

/**
 * 在promise结束时，无论结果是fulfilled或者是rejected，都会执行指定的回调函数
 * 由于无法知道promise的最终状态，所以finally的回调函数中不接收任何参数，它仅用于无论最终结果如何都要执行的情况。
 * @param {function} cb
 * @returns {MyPromise}
 */
MyPromise.prototype.finally = function (cb) {
  return this.then(
    (value) => {
      isFunction(cb) && cb();
      return value;
    },
    (reason) => {
      isFunction(cb) && cb();
      throw reason;
    },
  );
};

/**
 * 方法返回一个 Promise 实例，所有的 promise 都“完成（resolved）”或参数中不包含 promise 时回调完成（resolve）；
 * 如果参数中  promise 有一个失败（rejected），此实例回调失败（reject），失败的原因是第一个失败 promise 的结果。
 * @param {Iterable} arr
 * @returns {MyPromise}
 */
MyPromise.all = function (arr) {
  if (!isArrayLike(arr)) {
    throw new Error(`${arr} is not iterable (cannot read property Symbol(Symbol.iterator)`);
  }
  return new MyPromise((resolve, reject) => {
    const values = [];
    let i = 0;
    while (i < arr.length) {
      const current = arr[i];
      if (isMyPromise(current)) {
        current.then(
          (value) => {
            values.push(value);
            if (i >= arr.length) resolve(values);
          },
          (reason) => reject(reason),
        );
      } else {
        values.push(current);
      }
      i++;
    }
  });
};
