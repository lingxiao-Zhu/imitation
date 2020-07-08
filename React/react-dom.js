/**
 * @description
 */
let nextUnitOfWork = null;

/**
 * @description the work in progress root
 */
let wipRoot = null;

/**
 * @description last fiber tree we committed to the DOM
 */
let currentRoot = null;

/**
 * @description the fiber will be deleted after diff
 */
let deletions = null;

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
  deletions = [];
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
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
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

  // When there's no child and no sibling, return null, so workLoop will execute commitRoot()
  return null;
}

/**
 * Function components are differents in two ways:
 * the fiber from a function component doesn’t have a DOM node,
 * and the children come from running the function instead of getting them directly from the props
 * @param {*} fiber
 */
function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    // the fiber.dom property may exist by diff
    fiber.dom = createDOM(fiber);
  }
  // Create fiber nodes for children
  reconcileChildren(fiber, fiber.props.children);
}

/**
 * When we want to update or delete nodes，we should compare the current fiber tree with the last。
 * So we need to save a reference to the last fiber tree，we call it "currentRoot"
 * we also add the "alternate" property to every fiber，which is a link to the old fiber
 * @param {*} wipFiber
 * @param {*} elements
 */
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;
  while (index < elements.length || oldFiber) {
    const element = elements[index];
    const sameType = oldFiber && element && element.type === oldFiber.type;
    let newFiber = null;
    // update the node with the new props
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE',
      };
    } else {
      if (element) {
        // add this node
        newFiber = {
          type: element.type,
          props: element.props,
          dom: null,
          parent: wipFiber,
          alternate: null,
          effectTag: 'PLACEMENT',
        };
      }
      if (oldFiber) {
        // delete the oldFiber's node
        oldFiber.effectTag = 'DELETION';
        deletions.push(oldFiber);
      }
    }

    if (oldFiber) oldFiber = oldFiber.sibling;

    if (index === 0) {
      wipFiber.child = newFiber;
    } else {
      prevSibling && (prevSibling.sibling = newFiber);
    }
    prevSibling = newFiber;
    index++;
  }
}

const isEvent = (key) => key.startsWith('on');
const isProperty = (key) => key !== 'children' && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key];
const isGone = (prev, next) => (key) => key in prev && !(key in next);
/**
 * update dom
 * @param {HTMLElement} dom
 * @param {*} prevProps
 * @param {*} nextProps
 */
function updateDom(dom, prevProps, nextProps) {
  // Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });

  // Remove old properties
  Object.keys(prevProps)
    .filter(isNew)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => (dom[name] = ''));

  // Update or set new properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => (dom[name] = nextProps[name]));
}

/**
 * Here we recursively append all the nodes to the dom.
 */
function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) return;

  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  if (fiber.effectTag === 'PLACEMENT' && fiber.dom !== null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'DELETION') {
    commitDeletion(fiber, domParent);
  } else if (fiber.effectTag === 'UPDATE') {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

const ReactDOM = {
  render,
};

export default ReactDOM;
