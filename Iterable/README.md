# Iteration protocols

JavaScript 原有的表示“集合”的数据结构，主要是数组（Array）和对象（Object），ES6 又添加了 Map 和 Set。这样就有了四种数据集合，用户还可以组合使用它们，定义自己的数据结构，比如数组的成员是 Map，Map 的成员是对象。这样就需要一种统一的接口机制，来处理所有不同的数据结构。

遍历器（Iterator）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。

目前所有的内置可迭代对象如下：String、Array、TypedArray、Map 和 Set，它们的原型对象都实现了 @@iterator 方法。

## Plans

- [x] 自定义可迭代对象
- [x] 实现 Thunk 函数，用于生成器中的回调异步自动执行
- [x] 实现 co 模块，用于生成器中的 Promise 对象自动执行
- [x] 实现 Async/Await 语法糖

##  生成器流程控制

```javascript
// 异步操作
function* gen() {
  const url = 'https://api.github.com/users/github';
  const result = yield fetch(url);
  console.log(result.bio);
}

// 流程控制
const g = gen();
const result = g.next();

result.value
  .then((data) => data.json())
  .then(function (data) {
    g.next(data);
  });

// 可以看到，虽然 Generator 函数将异步操作表示得很简洁，但是流程管理却不方便
```
