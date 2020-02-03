const path = require('path');
const fs = require('fs');
class Module {
  constructor({ request, loaders, context }) {
    this.dependencies = [];
    this.source = null;
    this.request = request; // 相对路径
    this.loaders = loaders;
    this.context = context;
    this.resourcePath = path.join(context, request); // 绝对路径
  }

  build(callback) {
    this.runLoaders(callback);
  }

  // 执行loaders处理源文件
  runLoaders(callback) {
    const loaderContext = {
      loaderIndex: 0,
    };
    const processOptions = {
      resourceText: null,
      readResource: fs.readFileSync,
    };

    this.iteratePitchingLoaders(processOptions, loaderContext, callback);
  }

  /**
   * 执行loader的pitch方法
   * @param {loaderContext} loaderContext
   * @param {*} callback
   */
  iteratePitchingLoaders(options, loaderContext, callback) {
    // 执行完所有的pitch方法后，需执行loader方法
    if (loaderContext.loaderIndex >= this.loaders.length) {
      return this.processResource(options, loaderContext, callback);
    }

    const fn = this.loaders[loaderContext.loaderIndex].pitch;
    loaderContext.loaderIndex++;

    // 当前loader的pitch方法不存在，执行下一个
    if (!fn) {
      return this.iteratePitchingLoaders(loaderContext, callback);
    }

    // 如果pitch函数返回值，则跳过后续的pitch方法，直接开始执行loader方法
    // 这里省略了webpack源码中 remainingRequest 等参数，方便简单理解。
    const pitchResult = fn();
    if (!pitchResult) {
      return this.iteratePitchingLoaders(loaderContext, callback);
    } else {
      this.iterateNormalLoaders(options, loaderContext, pitchResult, callback);
    }
  }

  // 加载文件的内容
  processResource(options, loaderContext, callback) {
    const source = options.readResource(this.resourcePath, 'utf-8'); // 加载文件内容
    options.resourceText = source;
    this.source = source;
    this.iterateNormalLoaders(options, loaderContext, source, callback);
  }

  /**
   * 执行loader
   * @param {*} options
   * @param {*} loaderContext
   * @param {*} source 文件内容
   * @param {*} callback
   */
  iterateNormalLoaders(options, loaderContext, source, callback) {
    // TODO: 遍历循环loaders
  }
}

module.exports = Module;
