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
  observe(val);

  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: false,
    get: function () {
      // 由于需要在闭包内添加watcher，所以通过Dep定义一个全局target属性，暂存watcher, 添加完移除
      Dep.target && dep.addSub(Dep.target);
      return value;
    },
    set: function (newVal) {
      console.log('哈哈哈，监听到值变化了 ', val, ' --> ', newVal);
      val = newVal;
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
  get(key) {
    Dep.target = this;
    this.value = data[key]; // 这里会触发属性的getter，从而添加订阅者
    Dep.target = null;
  }
}

/**
 * 解析模板指令，将模板中的变量替换成数据
 * @param {*} el
 */
function Compile(el) {
  this.$el = this.isElementNode(el) ? el : document.querySelector(el);
  if (this.$el) {
    this.$fragment = this.node2Fragment(this.$el);
    this.init();
    this.$el.appendChild(this.$fragment);
  }
}
Compile.prototype = {
  init: function () {
    this.compileElement(this.$fragment);
  },
  node2Fragment: function (el) {
    var fragment = document.createDocumentFragment(),
      child;
    // 将原生节点拷贝到fragment
    while ((child = el.firstChild)) {
      fragment.appendChild(child);
    }
    return fragment;
  },
  compileElement: function (el) {
    const childNodes = el.childNodes;
    [].slice.call(childNodes).forEach((node) => {
      const text = node.textContent;
      const reg = /\{\{(.*)\}\}/; // 表达式文本
      if (this.isElementNode(node)) {
        this.compile(node);
      } else if (this.isTextNode(node) && reg.test(text)) {
        this.compileText(node, RegExp.$1);
      }
      // 遍历编译子节点
      if (node.childNodes && node.childNodes.length) {
        me.compileElement(node);
      }
    });
  },
  compile(node) {
    const nodeAttrs = node.attributes;
    [].slice.call(nodeAttrs).forEach((attr) => {
      // 规定：指令以 v-xxx 命名
      // 如 <span v-text="content"></span> 中指令为 v-text
      const attrName = attr.name; // v-text
      if (me.isDirective(attrName)) {
        const exp = attr.value; // content
      }
    });
  },
  compileText(node) {},
  isTextNode(node) {},
};
