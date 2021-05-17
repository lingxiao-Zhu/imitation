function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}
/**
 * 广度优先遍历
 * @param {TreeNode} root
 */
function bfs(root) {
  var queue = [root];
  var n;

  while (queue.length > 0) {
    n = queue.shift();
    if (!n) continue;
    queue.push(n.left);
    queue.push(n.right);
    console.log(n.val);
  }
}

/**
 * 深度优先遍历
 * @param {TreeNode} root
 */
function dfs(root) {
  if (!root) return;
  console.log(root.val);
  dfs(root.left);
  dfs(root.right);
}

const a = new TreeNode('a');
const b = new TreeNode('b');
const c = new TreeNode('c');
const d = new TreeNode('d');
const e = new TreeNode('e');
const f = new TreeNode('f');
const g = new TreeNode('g');

a.left = b;
a.right = c;
b.left = d;
b.right = e;
c.left = f;
c.right = g;

dfs(a);
