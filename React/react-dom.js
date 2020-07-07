/**
 * @desc
 */
let nextUnitOfWork = null;

/**
 *
 * @param {*} element
 * @param {HTMLDivElement} container
 */
function render(element, container) {
  // set root of the fiber tree
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
}

function createDOM(fiber) {
  // if the element type is TEXT_ELEMENT we create a text node instead of a regular node.
  const { type, props } = fiber;
  const dom = type == 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type);
  // assign the element props to the node.
  const isProperty = (key) => key !== 'children';
  Object.keys(props)
    .filter(isProperty)
    .forEach((name) => (dom[name] = props[name]));
  return dom;
}

/**
 * There’s a problem with this recursive call.
 * Once we start rendering, we won’t stop until we have rendered the complete element tree.
 * If the element tree is big, it may block the main thread for too long.
 * And if the browser needs to do high priority stuff like handling user input or keeping an animation smooth,
 * it will have to wait until the render finishes.
 *
 * So we are going to break the work into small units,
 * and after we finish each unit we’ll let the browser interrupt the rendering
 * if there’s anything else that needs to be done.
 */

/**
 * React doesn’t use requestIdleCallback anymore.
 * Now it uses the scheduler package.
 * But for this use case it’s conceptually the same.
 * @param {requestIdleCallback} deadline
 */
function workLoop(deadline) {
  let shouldYield = false;
  // Perform work until Scheduler asks us to yield
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}

// start first unit of work
requestIdleCallback(workLoop);

/**
 * To organize the units of work we’ll need a data structure: a fiber tree.
 * We’ll have one fiber for each element and each fiber will be a unit of work.
 *
 * In the render we’ll create the root fiber and set it as the nextUnitOfWork.
 *
 * The rest of the work will happen on the performUnitOfWork function,
 * there we will do three things for each fiber:
 * 1.add the element to the DOM
 * 2.create the fibers for the element’s children
 * 3.select the next unit of work
 * @param {nextUnitOfWork} fiber
 * @returns {*} the next unit of work
 */
function performUnitOfWork(fiber) {
  // keep track of the DOM node in the fiber.dom property
  if (!fiber.dom) fiber.dom = createDOM(fiber);
  if (fiber.parent) fiber.parent.dom.appendChild(fiber.dom);

  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    if (index === 0) {
      // set child
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }
}

const ReactDOM = {
  render,
};

export default ReactDOM;
