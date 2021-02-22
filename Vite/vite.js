const fs = require('fs');
const koa = require('koa2');
const path = require('path');
const compilerSfc = require('@vue/compiler-sfc');
const compilerDOM = require('@vue/compiler-dom');

const app = new koa();

app.use(async (ctx) => {
  const {
    request: { url, query },
  } = ctx;

  if (url === '/') {
    ctx.type = 'text/html';
    const htmlPath = path.resolve(__dirname, 'index.html');
    ctx.body = fs.readFileSync(htmlPath, 'utf-8').replace(
      '<script ',
      `
    <script>
      window.process = {env:{ NODE_ENV:'dev'}}
    </script>
    <script 
  `,
    );
  } else if (url.endsWith('.js')) {
    const jsPath = path.resolve(__dirname, url.slice(1));
    ctx.type = 'application/javascript';
    const content = fs.readFileSync(jsPath, 'utf-8');
    ctx.body = rewriteImport(content);
  } else if (url.startsWith('/@modules/')) {
    // 这里是npm包
    const prefix = path.resolve(__dirname, '..', 'node_modules', url.replace('/@modules/', ''));
    const module = require(prefix + '/package.json').module;
    const source = fs.readFileSync(path.resolve(prefix, module), 'utf-8');
    ctx.type = 'application/javascript';
    ctx.body = rewriteImport(source);
  } else if (url.indexOf('.vue') > -1) {
    // vue单文件组件
    // vue单文件组件
    const p = path.resolve(__dirname, url.split('?')[0].slice(1));
    const { descriptor } = compilerSfc.parse(fs.readFileSync(p, 'utf-8'));
    console.log(descriptor);
    if (!query.type) {
      ctx.type = 'application/javascript';
      // 借用vue自导的compile框架 解析单文件组件，其实相当于vue-loader做的事情
      ctx.body = `
        // option组件
        ${rewriteImport(descriptor.script.content.replace('export default ', 'const __script = '))}
        import { render as __render } from "${url}?type=template"
        __script.render = __render
        export default __script
       `;
    }

    if (query.type === 'template') {
      const template = descriptor.template;
      const render = compilerDOM.compile(template.content, {
        mode: 'module',
      }).code;
      ctx.type = 'application/javascript';
      ctx.body = rewriteImport(render);
    }
  }
});

/**
 * 替换 node_modules 包路径
 * @example
 * import vue from "vue" => import vue from "/@module/vue"
 * @param {string} content
 */
function rewriteImport(content) {
  return content.replace(/from ['"]([^'"]+)['"]/g, function (match, p1) {
    if (p1[0] !== '.' && p1[1] !== '/') {
      return `from '/@modules/${p1}'`;
    } else {
      return match;
    }
  });
}

app.listen(3000);
