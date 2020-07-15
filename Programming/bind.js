/**
 * @version 1.0
 * @param {*} context
 * @param  {...any} outerArgs
 */
Function.prototype.bind = function (context, ...outerArgs) {
  return (...innerArgs) => {
    this.apply(context, [...outerArgs, ...innerArgs]);
  };
};

// 1.0 存在一个问题，就是当返回的bind函数遇到new关键字，会失效

/**
 * @version 1.1
 * @param {*} context
 * @param  {...any} outerArgs
 */
Function.prototype.bind = function (context, ...outerArgs) {
  const self = this;
  const fBound = function () {
    self.apply(this instanceof fBound ? this : context, [...outerArgs, ...innerArgs]);
  };
  fBound.prototype = this.prototype;
  return fBound;
};

// 1.1 存在一个问题，那就是fBound的原型链直接指向链this的，如果直接修改fBound的原型链，会污染 this的

/**
 * @version 1.2
 * @param {*} context
 * @param  {...any} outerArgs
 */
Function.prototype.bind = function (context, ...outerArgs) {
  const self = this;
  const fBound = function () {
    self.apply(this instanceof fBound ? this : context, [...outerArgs, ...innerArgs]);
  };
  fBound.prototype = Object.create(this.prototype);
  // Object.create 等价于
  // function fNOP(){}
  // fNOP.prototype = this.prototype;
  // fBound.prototype = new temp();
  return fBound;
};

// 1.2 有个小问题，就是如果 bind 方法被非函数调用，就会报错，所以需要判断一下

/**
 * @version 1.3
 * @param {*} context
 * @param  {...any} outerArgs
 */
Function.prototype.bind = function (context, ...outerArgs) {
  if (typeof this !== 'function') {
    throw new Error('Function.prototype.bind must be called by function');
  }

  const self = this;
  const fBound = function () {
    self.apply(this instanceof fBound ? this : context, [...outerArgs, ...innerArgs]);
  };
  fBound.prototype = Object.create(this.prototype);
  return fBound;
};
