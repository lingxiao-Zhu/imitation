Function.prototype.bind = function (target, ...outerArgs) {
  const oThis = this;
  if (typeof oThis !== 'function') {
    throw new Error('bind must be called by function');
  }
  const fBound = function (...innerArgs) {
    const args = outerArgs.concat(innerArgs);
    return this instanceof fBound ? oThis.apply(this, args) : oThis.apply(target, args);
  };
  fBound.prototype = Object.create(oThis.prototype);
  return fBound;
};
