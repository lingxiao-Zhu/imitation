// @lc code=start
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} subRoot
 * @return {boolean}
 */
var isSubtree = function (root, subRoot) {
  if (!root) return false;
  if (compare(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
};

/**
 *
 * @param {TreeNode} root1
 * @param {TreeNode} root2
 */
var compare = function (root1, root2) {
  if (!root1 && !root2) return true;
  if (root1 && !root2) return false;
  if (root2 && !root1) return false;
  if (root1.val !== root2.val) return false;

  return compare(root1.left, root2.left) && compare(root1.right, root2.right);
};

// @lc code=end
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}
