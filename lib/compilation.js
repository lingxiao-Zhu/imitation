const path = require('path');
const { Tapable, SyncHook } = require('tapable');

class Compilation extends Tapable {
  constructor(compiler, moduleFactory) {
    super();
    this.hooks = {
      succeedEntry: new SyncHook(['entry', 'name', 'module']),
    };
    this.compiler = compiler;
    this.moduleFactory = moduleFactory;
    this.entries = [];
    this.modules = [];
    this.assets = [];
  }

  /**
   * 从entry开始构建
   * @param {*} context context path for entry
   * @param {*} entry
   * @param {*} name name of entry
   * @param {*} callback
   * @returns {void}
   */
  addEntry(context, entry, name, callback) {
    this._addModuleChain(context, entry, (module) => {
      this.hooks.succeedEntry.call(entry, name, module);
      callback(module);
    });
  }

  /**
   *
   * @param {*} context
   * @param {*} dependency
   * @param {*} callback
   * @returns {void}
   */
  _addModuleChain(context, dependency, callback = () => {}) {
    // 通过工厂创建一个module对象，目前只支持js模块工厂。
    this.moduleFactory.create({ context, dependency }, (module) => {
      // 存储module
      this.modules.push(module);
      // 存储entry
      this.entries.push(module);
      // 分析module的依赖和执行loaders
      module.build(() => {
        this.processModuleDependencies(module, () => {
          callback();
        });
      });
    });
  }

  /**
   * 遍历模块的依赖
   * @param {*} module
   * @param {*} callback
   */
  processModuleDependencies(module, callback) {
    if (module.dependencies.length > 0) {
      module.dependencies.forEach((dep) => {
        const context = '';
        // TODO:找出米模块的context
        this._addModuleChain(context, dep);
      });
    } else {
      console.log(this.modules);
      callback();
    }
  }

  seal() {
    this.buildChunkGraph();
  }

  createChunkAssets() {}

  buildChunkGraph() {}
}

module.exports = Compilation;
