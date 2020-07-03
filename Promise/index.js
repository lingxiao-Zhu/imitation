const isMyPromise = (target) => target instanceof MyPromise;
const isFunction = (fn) => Object.prototype.toString.call(fn) === '[object Function]';
const isThenable = (value) => value && isFunction(value.then);
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

/**
 * 返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。
 * @param {Iterable} arr
 * @returns {MyPromise}
 */
MyPromise.race = function (arr) {
  if (!isArrayLike(arr)) {
    throw new Error(`${arr} is not iterable (cannot read property Symbol(Symbol.iterator)`);
  }

  return new MyPromise((resolve, reject) => {
    let i = 0;
    while (i < arr.length) {
      const current = arr[i++];
      if (isMyPromise(current)) {
        current.then(resolve, reject);
      } else {
        resolve(current);
      }
    }
  });
};

/**
 * 方法返回一个以给定值解析后的Promise 对象。如果这个值是一个 promise ，那么将返回这个 promise ；
 * 如果这个值是thenable（即带有"then" 方法），返回的promise会“跟随”这个thenable的对象，采用它的最终状态；
 * 否则返回的promise将以此值完成。
 * 此函数将类promise对象的多层嵌套展平。
 * @param {*} value
 * @returns {MyPromise}
 * @example MyPromise.resolve({ then: (res) => res({ then: (res) => res(1) }) })
 */
MyPromise.resolve = function (value) {
  if (isMyPromise(value)) return value;

  return new MyPromise((resolve, reject) => {
    // 多层嵌套展平
    if (isThenable(value)) {
      try {
        (function desThenable(value) {
          if (!isThenable(value)) return resolve(value);
          value.then(desThenable);
        })(value);
      } catch (e) {
        reject(e);
      }
    } else {
      resolve(value);
    }
  });
};

/**
 * 返回一个带有拒绝原因的Promise对象。
 * @param {*} reason
 * @returns {MyPromise}
 */
MyPromise.reject = function (reason) {
  return new MyPromise((resolve, reject) => {
    if (isMyPromise(reason)) {
      reason.finally(reject);
    } else {
      reject(reason);
    }
  });
};
