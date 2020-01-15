const fs = require('fs');
const path = require('path');
const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');

let moduleID = 0;

/**
 * 读取文件内容，分析文件的依赖关系
 * @param {*} filePath 文件路径
 * @return {object} 返回当前文件的内容和依赖关系
 */
function createAsset(filePath) {
  // 获取文件内容，返回值是字符串
  const content = fs.readFileSync(filePath, 'utf-8');

  // 生成抽象语法树
  const astTree = babylon.parse(content, {
    sourceType: 'module',
  });

  // 用来存储 文件所依赖的模块，简单来说就是，当前js文件 import 了哪些文件，都会保存在这个数组里
  const dependencies = [];

  // 找出依赖
  traverse(astTree, {
    ImportDeclaration: ({ node }) => {
      // 把当前依赖的模块加入到数组中，其实这存的是字符串，
      // 例如 如果当前js文件 有一句 import message from './message.js'，
      // './message.js' === node.source.value
      dependencies.push(node.source.value);
    },
  });

  // 模块的id从0开始， 相当一个js文件可以看成一个模块
  const id = moduleID++;

  // 将ES6的代码转成ES5
  const { code } = babel.transformFromAstSync(astTree, null, {
    presets: ['@babel/preset-env'],
  });

  return {
    id,
    filePath,
    dependencies,
    code,
  };
}

/**
 * 从入口开始分析所有依赖项，形成依赖图
 * @param {*} entryPath 入口文件路径
 * @returns {Array} 返回依赖图
 */
function createGraph(entryPath) {
  const mainAsset = createAsset(entryPath);

  const queue = [mainAsset];

  for (const asset of queue) {
    // 获取入口文件所在的目录
    const dirname = path.dirname(asset.filePath);

    //新增一个属性来保存子依赖项的数据
    //保存类似 这样的数据结构 --->  {"./message.js" : 1}
    asset.mapping = {};

    // 广度优先的分析依赖
    asset.dependencies.forEach((relativePath) => {
      //获得子依赖（子模块）的依赖项、代码、模块id，文件名
      childAsset = createAsset(path.join(dirname, relativePath));

      //给子依赖项赋值，
      asset.mapping[relativePath] = childAsset.id;

      //将子依赖也加入队列中，广度遍历
      queue.push(childAsset);
    });
  }

  return queue;
}

/**
 * 生成可运行在浏览器中的js文件
 * @returns {*} 返回js文件
 */
function bundler(entryPath) {
  const graph = createGraph(entryPath);

  let modules = '';

  //循环依赖关系，并把每个模块中的代码存在function作用域里
  graph.forEach((mod) => {
    modules += `${mod.id}:[
      function (require, module, exports){
        ${mod.code}
      },
      ${JSON.stringify(mod.mapping)},
    ],`;
  });

  //require, module, exports 是 cjs的标准不能再浏览器中直接使用，所以这里模拟cjs模块加载，执行，导出操作。
  return `(function(modules){
    //创建require函数， 它接受一个模块ID（这个模块id是数字0，1，2） ，它会在我们上面定义 modules 中找到对应是模块.
    function require(id){
      const [fn, mapping] = modules[id];
      function localRequire(relativePath){
        //根据模块的路径在mapping中找到对应的模块id
        return require(mapping[relativePath]);
      }
      const module = {exports:{}};
      //执行每个模块的代码。
      fn(localRequire, module, module.exports);
      return module.exports;
    }
    //执行入口文件，
    require(0);
  })({${modules}})`;
}

// 开始打包
const bundle = bundler('./demo/app.js');

if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist');
}

fs.writeFileSync('./dist/bundle.js', bundle, 'utf-8');
