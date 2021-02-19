// koa
const middleware1 = async (ctx, next) => {
  console.log('1 start');
  ctx.a = 1;
  await next();
  console.log('1 end', ctx);
};
const middleware2 = async (ctx, next) => {
  console.log('2 start');
  ctx.b = 1;
  await next();
  console.log('2 end');
};
const middleware3 = async (ctx, next) => {
  console.log('3 start');
  await new Promise((resolve) => {
    setTimeout(resolve, 5000);
  });
  ctx.c = 1;
  await next();
  console.log('3 end');
};

function compose1(...middleware) {
  const ctx = {};
  return middleware.reduceRight(
    (a, b) => {
      // return Promise
      const next = () => b(ctx, a);
      return next;
    },
    () => {},
  );
}

function compose2(...middleware) {
  const ctx = {};
  let lastIndex = -1;
  return () => {
    function dispatch(index) {
      if (index <= lastIndex) return Promise.reject(new Error('next() called multiple times'));
      lastIndex = index;
      const fn = middleware[index];
      if (!fn) return Promise.resolve();
      return fn(ctx, dispatch.bind(null, index + 1));
    }

    dispatch(0);
  };
}

compose1(middleware1, middleware2, middleware3)();
compose2(middleware1, middleware2, middleware3)();
