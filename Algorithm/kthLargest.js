function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}

var res = [];
/**
 * @description 剑指 Offer 54. 二叉搜索树的第k大节点
 * 二叉搜索树，左子树所有节点的值都小于根节点。
 *
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
var kthLargest = function (root, k) {
  var res = [];

  var helper = function (node) {
    if (!node) return;
    helper(node.right);
    res.push(node.val);
    helper(node.left);
  };

  helper(root);

  return res[k - 1];
};
