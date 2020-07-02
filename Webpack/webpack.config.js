const path = require('path');
const BeforeCompilePlugin = require('./plugins/BeforeCompilePlugin');
const AfterCompilePlugin = require('./plugins/AfterCompilePlugin');

module.exports = {
  context: path.join(__dirname, './demo'), // base directory
  entry: './app.js',
  output: {
    path: '/dist',
    filename: 'bundle.js',
  },
  plugins: [new BeforeCompilePlugin(), new AfterCompilePlugin()],
  module: {
    rules: [
      {
        test: '.js',
        loader: require('./loaders/demo-loader'),
      },
    ],
  },
};
