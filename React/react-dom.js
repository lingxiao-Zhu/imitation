/**
 * @description
 */
let nextUnitOfWork = null;

/**
 * @description the work in progress root
 */
let wipRoot = null;

/**
 * @description
 */
let currentRoot = null;

/**
 *
 * @param {*} element
 * @param {HTMLDivElement} container
 */
function render(element, container) {
  // set root of the fiber tree
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    // We add the alternate property to every fiber.
    // This property is a link to the old fiber,
    // the fiber that we committed to the DOM in the previous commit phase.
    alternate: currentRoot,
  };
  nextUnitOfWork = wipRoot;
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

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
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
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }

  // Finally we search for the next unit of work.
  // We first try with the child,
  // then with the sibling,
  // then with the uncle, and so on.
  if (fiber.child) return fiber.child;

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }

  // When there's no child and no sibling, return null, workLoop will excute commitRoot()
  return null;
}

/**
 *
 * @param {*} wipFiber
 * @param {*} elements
 */
function reconcileChildren(wipFiber, elements) {}

/**
 * Here we recursively append all the nodes to the dom.
 */
function commitRoot() {
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

const ReactDOM = {
  render,
};

export default ReactDOM;
