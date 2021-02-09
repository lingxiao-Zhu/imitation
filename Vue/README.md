![](../.screenshots/vue.png?raw=true)

# Vue

## MVVM

要实现 mvvm 的双向绑定，就必须要实现以下几点：

- 实现一个数据监听器 Observer，能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知订阅者。
- 实现一个指令解析器 Compile，对每个元素节点的指令进行扫描和解析，根据指令模板替换数据，以及绑定相应的更新函数。
- 实现一个 Watcher，作为连接 Observer 和 Compile 的桥梁，能够订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数，从而更新视图。
- 入口函数，整合以上三者。

## Object.defineProperty VS Proxy
