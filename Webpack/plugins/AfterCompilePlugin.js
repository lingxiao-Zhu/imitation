class AfterCompilePlugin {
  apply(compiler) {
    compiler.hooks.afterCompile.tap('AfterCompilePlugin', () => {
      console.log('AfterCompilePlugin called');
    });
  }
}

module.exports = AfterCompilePlugin;
