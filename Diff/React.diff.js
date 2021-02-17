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

function diff(oldTree, newTree) {
  let patches = {};
  // 递归树， 比较后的结果放到补丁包中
  walk(oldTree, newTree, Index, patches);
  return patches;
}

/**
 * 深度优先
 * @param {ReactElement} oldNode
 * @param {ReactElement} newNode
 * @param {number} Index
 * @param {*} patches
 */
function walk(oldNode, newNode, Index, patches) {
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
    diffChildren(oldNode.children, newNode.children, patches);
  } else {
    // 说明节点被替换
    currentPatch.push({
      type: REPLACE,
      newNode,
    });

    currentPatch.length ? (patches[index] = currentPatch) : null;
  }
}

function diffAttr() {
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

function diffChildren(oldChildren, newChildren, patches) {
  oldChildren.forEach((child) => {
    // index 每次传递给walk时， index应该是递增的.所有的都基于同一个Index
    walk(child, newChildren[idx], ++Index, patches);
  });
}
