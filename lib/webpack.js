const Compiler = require('./compiler');
const BeforeCompilePlugin = require('../plugins/BeforeCompilePlugin');
const AfterCompilePlugin = require('../plugins/AfterCompilePlugin');

const options = {
  entry: '/demo/app.js',
  output: {
    path: '/dist',
  },
  plugins: [new BeforeCompilePlugin(), new AfterCompilePlugin()],
};

const compiler = new Compiler(options);

if (options.plugins && Array.isArray(options.plugins)) {
  for (const plugin of options.plugins) {
    plugin.apply(compiler);
  }
}

compiler.run();
