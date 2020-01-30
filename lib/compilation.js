const { Tapable, SyncHook, AsyncSeriesHook } = require('tapable');
const Module = require('./module');

class Compilation extends Tapable {
  constructor(compiler) {
    super();
    this.hooks = {};
    this.compiler = compiler;
    this.modules = [];
    this.assets = [];
  }

  addEntry() {}

  _addModuleChain() {}

  buildModule() {}

  seal() {
    buildChunkGraph();
  }

  createChunkAssets() {}

  buildChunkGraph() {}

  addModuleDependencies() {}

  processModuleDependencies() {}
}
