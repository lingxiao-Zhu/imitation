const ATTRS = 'ATTRS'; //属性改变
const TEXT = 'TEXT'; //文本改变
const REMOVE = 'REMOVE'; //移除操作
const REPLACE = 'REPLACE'; //替换操作

let Index = 0; // Tree diff 层级

function isString(node) {
  return Object.prototype.toString.call(node) === '[object String]';
}

const REACT_ELEMENT_TYPE = (typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element')) || 0xeac7;

function ReactElement(type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allow us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE, //重点在这里

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner,
  };

  return element;
}

/**
 * 深度优先
 * @param {ReactElement} oldNode
 * @param {ReactElement} newNode
 * @param {number} index
 * @param {*} patches
 */
function diffSingle(oldNode, newNode, index, patches) {
  const currentPatches = [];

  if (!newNode) {
    currentPatch.push({
      type: REMOVE,
      index,
    });
    // 判断是否为文本
  } else if (isString(oldNode) && isString(newNode)) {
    if (newNode !== oldNode) {
      currentPatches.push({
        type: TEXT,
        text: newNode,
      });
    }
  } else if (oldNode.type === newNode.type) {
    // 类型相同，比较属性是否有更改
    const attrs = diffAttr(oldNode.props, newNode.props);
    if (Object.keys(attrs).length > 0) {
      currentPatch.push({
        type: ATTRS,
        attrs,
      });
    }
    // 比较儿子们
    diffChildren(oldNode.children, newNode.children, ++index, patches);
  } else {
    // 说明节点被替换
    currentPatch.push({
      type: REPLACE,
      newNode,
    });
    currentPatch.length ? (patches[index] = currentPatch) : null;
  }
}

function diffAttr(oldAttrs, newAttrs) {
  let patch = {};
  // 判断老属性和新属性的关系
  for (let key in oldAttrs) {
    if (oldAttrs[key] !== newAttrs[key]) {
      patch[key] = newAttrs[key]; //有可能是undefined => 新节点中删了该属性
    }
  }

  // 新节点新增了很多属性
  for (let key in newAttrs) {
    if (!oldAttrs.hasOwnProperty(key)) {
      patch[key] = newAttrs[key];
    }
  }

  return patch;
}

/**
 * 两次循环：
 * 第一轮遍历：处理更新的节点
 * 第二轮遍历：处理剩下不属于更新的节点
 * @param {Array} oldChildren
 * @param {Array} newChildren
 * @param {Array} index
 * @param {*} patches
 */
function diffChildren(oldChildren, newChildren, index, patches) {
  let newIdx = 0;

  // 第一轮遍历，处理更新的节点
  for (; newIdx < newChildren.length; newIdx++) {
    // key相同
    const newNode = newChildren[newIdx];
    const oldNode = oldChildren[newIdx];

    if (!newNode) break;
    if (!oldNode) break;

    if (newNode.key === oldNode.key) {
      if (newNode.type === oldNode.type) {
        diffSingle(oldNode, newNode, index, patches);
      } else {
        // key相同type不同导致不可复用，会将old标记为DELETION，并继续遍历
      }
    } else {
      // key不同导致不可复用，立即跳出整个遍历，第一轮遍历结束。
      break;
    }
  }

  /**
   * 第一轮遍历完，有几种情况
   * 1.new与old同时遍历完，此时diff结束
   * 2.new没遍历完，old遍历完，此时只需要将new节点标记进行插入
   * 3.old没遍历完，new遍历完，此时只需要将old节点标记删除。
   * 4.都没遍历完
   */

  // 第二轮遍历，处理不属于更新的节点
  let lastPlacedIndex = newIdx; //最后一个可复用的节点在old中的位置索引

  for (; newIdx < newChildren.length; newIdx++) {
    const key = newChildren[newIdx].key;
    const oldIndex = getOldIndex(key);
    if (oldIndex >= lastPlacedIndex) {
      lastPlacedIndex = oldIndex;
    } else {
      // 节点位置改变了，需要标记向右移动
    }
  }
}

/**
 * 通过新集合中节点的key，找到当前节点在old集合中的idx
 * @param {*} key
 * @returns {number}
 */
function getOldIndex(key) {
  ///
}

/**
 * diff主入口
 * @param {*} oldTree
 * @param {*} newTree
 */
function main(oldTree, newTree) {
  let patches = {};
  if (newTree.$$typeof === REACT_ELEMENT_TYPE) {
    diffSingle(oldTree, newTree, Index, patches);
  }
  return patches;
}

/** ---------------------- doPatch ---------------------- */

function patch(dom, patches) {
  this.index = 0;
  this.allPatches = patches;
  this.walk(dom);
}

/**
 *
 * @param {HTMLElement} dom
 */
patch.prototype.walk = function (dom, index = 0) {
  let currentPatch = this.allPatches[index];
  let childNodes = dom.childNodes;
  childNodes.forEach((element) => this.walk(element, ++index));
  if (currentPatch) {
    doPatch(dom, currentPatch);
  }
};

/**
 * 真实DOM操作
 * @param {HTMLElement} node
 * @param {Array} patches
 */
patch.prototype.doPatch = function (node, patches) {
  patches.forEach((patch) => {
    switch (patch.type) {
      case ATTRS:
        this.setAttrs(node, patch.attrs);
        break;
      case TEXT:
        node.textContent = patch.text;
        break;
      case REPLACE:
        const { newNode } = patch;
        const _newNode = newNode instanceof Element ? render(newNode) : document.createTextNode(newNode);
        node.parentNode.replaceChild(_newNode, node);
        break;
      case REMOVE:
        node.parentNode.removeChild(node);
    }
  });
};

/**
 * 修改node attributes
 * @param {HTMLElement} node
 * @param {*} attrs
 */
patch.prototype.setAttrs = function (node, attrs) {
  const ALL_KEYS = Object.keys(attrs);
  ALL_KEYS.forEach((k) => {
    const v = props[k];
    if (k === 'className') {
      node.setAttribute('class', v);
    } else if (k === 'style') {
      if (typeof v === 'string') {
        node.style.cssText = v;
      }
      if (typeof v === 'object') {
        for (let i in v) {
          node.style[i] = v[i];
        }
      }
    } else if (k[0] === 'o' && k[1] === 'n') {
      const capture = k.indexOf('Capture') != -1;
      node.addEventListener(k.substring(2).toLowerCase(), v, capture);
    } else {
      node.setAttribute(k, v);
    }
  });
};

/**
 * 将vNode转为真实DOM
 * @param {ReactElement} vNode
 */
patch.prototype.render = function (vNode) {
  /// 这里就不实现了，专注于diff过程
};
