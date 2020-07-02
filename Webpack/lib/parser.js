const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');

function parser() {
  // 生成抽象语法树
  const astTree = babylon.parse(this.source || '', {
    sourceType: 'module',
  });

  // 找出依赖
  traverse(astTree, {
    ImportDeclaration: ({ node }) => {
      // 把当前依赖的模块加入到数组中，其实这存的是字符串，
      // 例如 如果当前js文件 有一句 import message from './message.js'，
      // './message.js' 等于 node.source.value
      this.dependencies.push(node.source.value);
    },
  });

  const { code } = babel.transformFromAstSync(astTree, null, {
    presets: ['@babel/preset-env'],
  });

  this.source = code;
}

module.exports = parser;
