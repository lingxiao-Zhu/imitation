/**
 * 深度优先遍历
 * @param {HTMLElement} root
 */
function traverseByDFS(root) {
  if (root.childNodes.length < 1) return;
  root.childNodes.forEach(traverseByDFS);
}

// 广度优先遍历
function traverseByBFS() {}
