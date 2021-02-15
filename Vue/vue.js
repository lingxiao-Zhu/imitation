/**
 * 订阅中心
 */
class Dep {
  constructor() {
    this.subs = [];
  }

  addSub(sub) {
    this.subs.push(sub);
  }

  notify() {
    this.subs.forEach(function (sub) {
      sub.update();
    });
  }
}

/**
 * 发布者
 * 监听实例data
 * @param {*} data
 */
function observe(data) {
  if (typeof data !== 'object') return;
  // 取出所有属性遍历，Object.keys取出的属性不包含原型上的
  Object.keys(data).forEach(function (key) {
    defineReactive(data, key, data[key]);
  });
}

function defineReactive(data, key, value) {
  const dep = new Dep();

  // 监听子属性
  observe(value);

  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: false,
    get: function () {
      // 由于需要在闭包内添加watcher，所以通过Dep定义一个全局target属性，暂存watcher, 添加完移除
      Dep.target && dep.addSub(Dep.target);
      return value;
    },
    set: function (newVal) {
      console.log('哈哈哈，监听到值变化了 ', value, ' --> ', newVal);
      value = newVal;
      // 通知所有订阅者
      dep.notify();
    },
  });
}

/**
 * 订阅者
 * 订阅data变化，触发dom变化
 */

class Watcher {
  constructor(vm, exp, cb) {
    this.cb = cb;
    this.vm = vm;
    this.exp = exp;
    // 此处为了触发属性的getter，从而在dep添加自己，结合Observer更易理解
    this.value = this.get();
  }
  update() {
    this.run();
  }
  get() {
    Dep.target = this; // 将当前订阅者指向自己
    var value = this.vm[this.exp]; // 触发getter，添加自己到属性订阅器中
    Dep.target = null; // 添加完毕，重置
    return value;
  }
  run() {
    var value = this.get(); // 取到最新值
    var oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      this.cb.call(this.vm, value, oldVal); // 执行Compile中绑定的回调，更新视图
    }
  }
}

/**
 * 解析模板指令，将模板中的变量替换成数据
 * @param {*} el
 */
class Compile {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);
    if (this.$el) {
      this.$fragment = this.node2Fragment(this.$el);
      this.init();
      this.$el.appendChild(this.$fragment);
    }
  }

  /**
   * 因为遍历解析的过程有多次操作dom节点，
   * 为提高性能和效率，会先将跟节点el转换成文档碎片fragment进行解析编译操作，
   * 解析完成，再将fragment添加回原来的真实dom节点中
   * @param {*} el
   */
  node2Fragment(el) {
    let fragment = document.createDocumentFragment();
    let child;
    // 将原生节点拷贝到fragment
    while ((child = el.firstChild)) {
      fragment.appendChild(child);
    }
    return fragment;
  }

  init() {
    this.compileElement(this.$fragment);
  }

  compileElement(el) {
    const childNodes = el.childNodes;

    Array.prototype.slice.call(childNodes).forEach((node) => {
      const text = node.textContent;

      if (this.isElementNode(node)) {
        this.compile(node);
      } else if (this.isTextNode(node)) {
        const reg = /\{\{(.*)\}\}/;
        reg.test(text) && this.compileText(node, RegExp.$1);
      }

      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node);
      }
    });
  }

  compileText(node, exp) {
    compileUtil.text(node, this.$vm, exp);
  }

  compile(node) {
    const nodeAttrs = node.attributes;
    [].slice.call(nodeAttrs).forEach((attr) => {
      // 规定：指令以 v-xxx 命名
      // 如 <span v-model="content"></span> 中指令为 v-model
      const attrName = attr.name; // v-model
      if (this.isDirective(attrName)) {
        const exp = attr.value; // content
        const dir = attrName.substring(2); // model
        if (this.isEventDirective(dir)) {
          // 事件指令, 如 v-on:click
          compileUtil.eventHandler(node, this.$vm, exp, dir);
        } else {
          // 普通指令
          compileUtil[dir] && compileUtil[dir](node, this.$vm, exp);
        }
      }
    });
  }

  isDirective(attr) {
    return attr.indexOf('v-') == 0;
  }

  isEventDirective(dir) {
    return dir.indexOf('on') === 0;
  }

  isElementNode(node) {
    return node.nodeType == 1;
  }

  isTextNode(node) {
    return node.nodeType == 3;
  }
}

const compileUtil = {
  text: function (node, vm, exp) {
    this.bind(node, vm, exp, 'text');
  },
  model: function (node, vm, exp) {
    this.bind(node, vm, exp, 'model');
    node.addEventListener('input', (e) => {
      vm[exp] = e.target.value;
    });
  },
  // ...省略
  bind: function (node, vm, exp, dir) {
    var updaterFn = updater[dir + 'Updater'];
    // 第一次初始化视图
    updaterFn && updaterFn(node, vm[exp]);
    // 实例化订阅者，此操作会在对应的属性消息订阅器中添加了该订阅者watcher
    new Watcher(vm, exp, function (value, oldValue) {
      // 一旦属性值有变化，会收到通知执行此更新函数，更新视图
      updaterFn && updaterFn(node, value, oldValue);
    });
  },
  eventHandler: function (node, vm, exp, dir) {
    var eventType = dir.split(':')[1],
      fn = vm.$options.methods && vm.$options.methods[exp];

    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false);
    }
  },
};

// 更新函数
const updater = {
  textUpdater: function (node, value) {
    node.textContent = typeof value == 'undefined' ? '' : value;
  },
  modelUpdater: function (node, value, oldValue) {
    node.value = typeof value == 'undefined' ? '' : value;
  },
  // ...省略
};

class Vue {
  constructor(options) {
    this.$options = options;
    this._data = this.$options.data;
    this.proxyData(this._data);
    observe(this._data);
    this.$compile = new Compile(options.el || document.body, this);
  }

  // 数据代理
  // 实现 vm.xxx -> vm._data.xxx
  proxyData(data) {
    Object.keys(data).forEach((key) => {
      this._proxyData(key);
    });
  }

  _proxyData(key) {
    Object.defineProperty(this, key, {
      configurable: false,
      enumerable: true,
      get: function proxyGetter() {
        return this._data[key];
      },
      set: function proxySetter(newVal) {
        this._data[key] = newVal;
      },
    });
  }
}
