// Definition for a binary tree node.
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}
/**
 * @param {TreeNode} root
 * @param {number} target
 * @description
 * 输入一棵二叉树和一个整数，
 * 打印出二叉树中节点值的和为输入整数的所有路径。
 * 从树的根节点开始往下一直到叶节点所经过的节点形成一条路径。
 * 
 * @example
 *            5
             / \
            4   8
           /   / \
          11  13  4
         /  \    / \
        7    2  5   1
        返回
    [
        [5,4,11,2],
        [5,8,4,5]
    ]
 * @return {number[][]}
 */
var pathSum = function (root, target) {
  const res = [];

  if (root.val === target) return res;

  /**
   *
   * @param {TreeNode} root
   * @param {number} target
   * @param {array>} combine
   */
  var dfs = (root, target, combine) => {
    if (!root) {
      return;
    }
    // if (root.val > target) return;
    if (root.val === target && !root.left && !root.right) {
      res.push([...combine, root.val]);
      return;
    }
    if (root.left) {
      dfs(root.left, target - root.val, [...combine, root.val]);
    }
    if (root.right) {
      dfs(root.right, target - root.val, [...combine, root.val]);
    }
  };

  dfs(root, target, []);

  return res;
};
