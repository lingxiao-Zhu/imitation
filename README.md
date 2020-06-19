# my_webpack

Learn webpack by build my own webpack

## usage

```javascript
node webpack.js
```

## project plan

- [x] 梳理 webpack 源码打包流程。
- [x] 按照源码从零实现完整的 webpack。
- [x] 引入 Tapable.js，支持 Plugin。
- [x] 支持 loaders。

## project structure

```bash
├── demo                        # 存放es6的js文件
├── lib                         # 主要目录
│   ├── compilation.js          # 构建实例，模块会被加载、封存
│   ├── compiler.js             # 负责流程控制
│   ├── mainTemplate.js         # 主文件模版，包含__webpack_require__等方法
│   ├── moduleTemplate.js       # 模块模版，包含 function (module, __webpack_exports__, __webpack_require__) {
│   ├── normalModule.js         # JS模块类，负责JS模块的构建
│   ├── normalModuleFactory.js  # JS模块工厂
│   ├── parser.js               # 解释器，生成AST，分析依赖
├── loaders                     # 存放自定义loader
├── plugins                     # 存放自定义插件
├── webpack.config.js           # webpack配置
├── webpack.js                  # 启动打包
```

## webpack 的源码执行流程

github 图挂了，挂上 [流程图](https://www.processon.com/view/link/5e254eeae4b00fbcc45d5ea8) 链接。
