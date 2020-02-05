const { Tapable, SyncHook, AsyncSeriesHook } = require('tapable');
const path = require('path');
const fs = require('fs');
const Compilation = require('./compilation');
const NormalModuleFactory = require('./normalModuleFactory');

class Compiler extends Tapable {
  constructor(options) {
    super();
    this.options = {
      ...options,
      context: process.cwd(),
    };
    this.hooks = {
      beforeCompile: new AsyncSeriesHook(), // 打包前
      afterCompile: new SyncHook(['bundle']), // 打包后
      afterEmit: new SyncHook(), // 生成资源到 output 目录之后。
    };
  }

  // 创建module工厂函数
  createNormalModuleFactory() {
    const moduleFactory = new NormalModuleFactory(this.options.context, this.options.module || {});
    return moduleFactory;
  }
  // 启动打包
  run() {
    this.hooks.beforeCompile.callAsync((err) => {
      if (!err) {
        this.compile();
      }
    });
  }

  // 开始打包
  compile() {
    const moduleFactory = this.createNormalModuleFactory();
    const compilation = new Compilation(this, moduleFactory);
    const { context, entry, fileName: name } = this.options;
    // 开始构建
    compilation.addEntry(context, entry, name, () => {
      compilation.seal((bundleFile) => {
        this.hooks.afterCompile.call(bundleFile);
        this.emit(bundleFile);
      });
    });
  }

  // 生成资源到 output 目录之后。
  emit(bundleFile) {
    const outputPath = path.join(process.cwd(), this.options.output.path);
    // 检查目录是否存在
    if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath);
    // 生成资源文件
    fs.writeFileSync(outputPath + '/bundle.js', bundleFile, 'utf-8');
    this.hooks.afterEmit.call();
  }
}

module.exports = Compiler;
