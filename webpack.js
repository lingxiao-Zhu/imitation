const Compiler = require('./lib/compiler');
const config = require('./webpack.config');

const compiler = new Compiler(config);

// 注册plugins
if (config.plugins && Array.isArray(config.plugins)) {
  for (const plugin of config.plugins) {
    plugin.apply(compiler);
  }
}

compiler.run();
