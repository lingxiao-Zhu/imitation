const BeforeCompilePlugin = require('./plugins/BeforeCompilePlugin');
const AfterCompilePlugin = require('./plugins/AfterCompilePlugin');

module.exports = {
  entry: '/demo/app.js',
  output: {
    path: '/dist',
    filename: 'bundle.js',
  },
  plugins: [new BeforeCompilePlugin(), new AfterCompilePlugin()],
  module: {
    rules: [
      {
        test: '.js',
        loader: function() {},
      },
      {
        test: '.ts',
        loader: function() {},
      },
    ],
  },
};
