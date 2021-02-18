const koa = require('koa2');

const app = new koa();

app.use(async (ctx) => {
  if (ctx.path === '/index.html') {
    const html = await readBody(ctx.body);
  }
});

app.listen(3000);
