class BeforeCompilePlugin {
  apply(compiler) {
    compiler.hooks.beforeCompile.tapAsync('BeforeCompilePlugin', (callBack) => {
      console.log('BeforeCompilePlugin called');
      callBack();
    });
  }
}

module.exports = BeforeCompilePlugin;
