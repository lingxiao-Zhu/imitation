Function.prototype.call2 = function (context) {
  if (typeof this !== 'function') {
    throw new Error('call must be called by function');
  }
  context = context || window;
  context.fn = this;

  const args = [];

  // 第0个是context，参数从第一个开始取
  for (let i = 1; i < arguments.length; i++) {
    args.push(`arguments[${i}]`);
  }

  // args自动toString：[1,2,3,4] => '1,2,3,4'
  // context.fn(arguments[1], arguments[2], ...);
  const res = eval(`context.fn(${args})`);
  delete context.fn;
  return res;
};
