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
    // 存储entry
    this._addModuleChain(context, entry, (module) => {
      this.hooks.succeedEntry.call(entry, name, module);
      callback();
    });
  }

  /**
   *
   * @param {*} context
   * @param {*} dependency
   * @param {*} callback
   * @returns {void}
   */
  _addModuleChain(context, dependency, callback) {
    // 通过工厂创建一个module对象，目前只支持js模块工厂。
    this.moduleFactory.create({ context, dependency }, (module) => {
      // 存储module
      this.modules.push(module);
      // 分析module的依赖和执行loaders
      module.build(() => {
        this.processModuleDependencies(module, () => {
          callback(module);
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
        // 获取依赖的绝对路径
        const context = path.resolve(module.context, dep);
        this._addModuleChain(path.dirname(context), dep, callback);
      });
    } else {
      callback();
    }
  }

  /**
   * @param {Callback} callback signals when the seal method is finishes
   * @returns {void}
   */
  seal(callback) {
    // 源码中，此处会进行一些优化操作，这里略过
    console.log(this);
    this.buildChunkGraph();
    this.createChunkAssets();
    callback();
  }

  buildChunkGraph() {}

  /**
   * 填充模版，生成 chunk
   */
  createChunkAssets() {}
}

module.exports = Compilation;
