/**
 *
 * @param {*} element
 * @param {HTMLDivElement} container
 */
function render(element, container) {
    // if the element type is TEXT_ELEMENT we create a text node instead of a regular node.
    const dom = element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type)

    // assign the element props to the node.
    const isProperty = key => key !== "children";
    Object.keys(element.props).filter(isProperty).forEach(name => dom[name] = element.props[name])

    // recursively do the same for each child.
    element.props.children.forEach(child => render(child, dom))
​
    container.appendChild(dom);
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
let nextUnitOfWork = null

function workLoop(deadline){
  
}

const ReactDOM = {
  render,
};

export default ReactDOM;
