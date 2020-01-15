const fs = require('fs');
const babylon = require('@babel/parser');
const traverse = require('@babel/traverse');

/**
 * 读取文件内容，分析文件的依赖关系
 * @param {*} path 文件绝对路径
 * @return {object} 返回当前文件的内容和依赖关系
 */
function createAssets(path) {
  // 获取文件内容，返回值是字符串
  const content = fs.readFileSync(path, 'utf-8');

  // 生成抽象语法树
  const astTree = babylon.parse(content, {
    sourceType: 'module',
  });

  //

  console.log(astTree);
}

createAssets('./demo/app.js');
