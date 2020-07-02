const NormalModule = require('./normalModule');

class NormalModuleFactory {
  constructor(context, options) {
    this.context = context;
    this.ruleSet = options.rules || []; // 拿到所有的loader
  }

  /**
   *
   * @param {object} result: { context, dependency }
   * @param {*} callback
   */
  create(result, callback) {
    // 拿到文件后缀
    const fileType = result.dependency.split('.')[1];
    // 找出匹配的loader
    const rules = this.ruleSet.filter((rule) => rule.test.includes(fileType));
    const loaders = rules.map((rule) => rule.loader);
    // 新建module
    const createdModule = new NormalModule({
      loaders,
      request: result.dependency,
      context: this.context,
    });
    callback(createdModule);
  }
}

module.exports = NormalModuleFactory;
