# my_webpack

Learn webpack by build my own webpack

## usage

```javascript
node webpack.js
```

## project plan

- [x] 梳理 webpack 源码打包流程。
- [x] 编写支持对 js 代码打包的简单版本。
- [x] 引入 Tapable.js，支持插件系统。
- [x] 支持 loaders。

## project structure

```bash
├── lib                         # 主要目录
│   ├── bundler.js              # 负责打包工作
│   ├── compilation.js          # 构建实例，模块会被加载、封存
│   ├── compiler.js             # 负责流程控制
│   ├── normalModule.js         # JS模块类，负责JS模块的构建
│   ├── normalmoduleFactory.js  # JS模块工厂
│   ├── parser.js               # 解释器，生成AST，分析依赖
├── demo                        # 存放es6的js文件
├── plugins                     # 存放自定义插件
├── loaders                     # 存放自定义loader
```

## webpack 的源码执行流程

github 图挂了，挂上 [流程图](https://www.processon.com/view/link/5e254eeae4b00fbcc45d5ea8) 链接。
