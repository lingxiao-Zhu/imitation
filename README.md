# my_webpack

Learn webpack by build my own webpack

## usage

```javascript
node lib/webpack.js
```

## project plan

- [x] 完成对 js 代码打包。
- [x] 引入 Tapable.js，支持插件系统。
- [x] 梳理 webpack 源码打包流程。

## project structure

```bash
├── lib                 # 主要目录
│   ├── bundler.js      # 负责打包工作
│   ├── compiler.js     # 负责流程控制
│   ├── webpack.js      # 入口文件
├── demo                # 存放es6的js文件
├── plugins             # 存放自定义插件
```

## webpack 的源码执行流程

github 图挂了，挂上 [流程图](https://www.processon.com/view/link/5e254eeae4b00fbcc45d5ea8) 链接。
