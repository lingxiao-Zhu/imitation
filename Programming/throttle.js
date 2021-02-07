function throttle1(fn, wait = 500) {
  let lastTime = Date.now();
  return function (...args) {
    const now = Date.now();
    if (now - las > wait) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}

/**
 * throttle1没有解决最后一次不触发的问题
 */
function throttle2(fn, wait = 500) {
  let lastTime = Date.now();
  let timer;
  return function (...args) {
    const now = Date.now();
    const period = now - las;
    if (period - las > wait) {
      clearTimeout(timer);
      fn.apply(this, args);
      lastTime = now;
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
        lastTime = Date.now();
      }, wait - period);
    }
  };
}
