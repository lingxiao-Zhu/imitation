/**
 *
 * @param {*} type 节点类型，eg：div、h1
 * @param {Object} props
 * @param  {...any} children
 */
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => (typeof child === 'object' ? child : createTextElement(child))),
    },
  };
}

/**
 *
 * @param {string} text
 */
function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

const React = {
  createElement,
};

export default React;
