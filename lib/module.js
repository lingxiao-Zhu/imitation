const { Tapable, SyncHook, AsyncSeriesHook } = require('tapable');

class Module extends Tapable {
  constructor(compiler) {
    super();
    this.hooks = {};
  }
}
