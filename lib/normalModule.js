const path = require('path');
const fs = require('fs');
const parser = require('./parser');

let id = 0; // moduleId，自增的
class NormalModule {
  constructor({ request, loaders, context }) {
    this.id = id++;
    this.dependencies = [];
    this.source = null;
    this.request = request; // 相对路径
    this.loaders = loaders;
    this.context = context; // 当前模块所在文件夹路径
    this.resourcePath = path.join(context, request); // 绝对路径
  }

  build(callback) {
    this.runLoaders(() => {
      // 生成ast，找出依赖
      parser.call(this);
      callback();
    });
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

    // 判断loader是否存在
    if (this.loaders.length > 0) {
      this.iteratePitchingLoaders(processOptions, loaderContext, callback);
    } else {
      callback();
    }
  }

  /**
   * 执行loader的pitch方法
   * @param {loaderContext} loaderContext
   * @param {*} callback
   */
  iteratePitchingLoaders(options, loaderContext, callback) {
    // 执行完所有的pitch方法后，需执行loader方法
    if (loaderContext.loaderIndex >= this.loaders.length) {
      loaderContext.loaderIndex--;
      return this.processResource(options, loaderContext, callback);
    }

    // 拿到当前loader的pitch方法
    const fn = this.loaders[loaderContext.loaderIndex].pitch;
    loaderContext.loaderIndex++;

    // 如果不存在，执行下一个
    if (!fn) {
      return this.iteratePitchingLoaders(options, loaderContext, callback);
    }

    // 如果pitch函数返回值，则跳过后续的pitch方法，直接开始执行loader方法
    // 这里省略了webpack源码中 remainingRequest 等参数，方便简单理解。
    const pitchResult = fn();
    if (!pitchResult) {
      return this.iteratePitchingLoaders(options, loaderContext, callback);
    } else {
      this.iterateNormalLoaders(options, loaderContext, pitchResult, callback);
    }
  }

  // 加载源文件的内容，执行loader
  processResource(options, loaderContext, callback) {
    const source = options.readResource(this.resourcePath, 'utf-8');
    options.resourceText = source;
    this.iterateNormalLoaders(options, loaderContext, callback);
  }

  /**
   * 执行loader
   * @param {*} options
   * @param {*} loaderContext
   * @param {*} source 文件内容
   * @param {*} callback
   */
  iterateNormalLoaders(options, loaderContext, callback) {
    // loader执行完得到，回到 compilation去遍历依赖
    if (loaderContext.loaderIndex < 0) {
      this.source = options.resourceText;
      return callback();
    }
    const fn = this.loaders[loaderContext.loaderIndex--];
    options.resourceText = fn.call(loaderContext, options.resourceText);
    return this.iterateNormalLoaders(options, loaderContext, callback);
  }
}

module.exports = NormalModule;
