// Definition for a binary tree node.
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 * @description
 * 根据一棵树的前序遍历与中序遍历构造二叉树。
 */
var buildTree = function (preorder, inorder) {
  if (preorder.length < 1 || inorder.length < 1) return null;

  const root = new TreeNode(preorder[0]);
  const rootInOrderIdx = inorder.indexOf(root.val);

  const leftIn = inorder.slice(0, rootInOrderIdx);
  const rightIn = inorder.slice(rootInOrderIdx + 1);

  const leftPre = preorder.slice(1, rootInOrderIdx + 1);
  const rightPre = preorder.slice(rootInOrderIdx + 1);

  root.left = buildTree(leftPre, leftIn);
  root.right = buildTree(rightPre, rightIn);

  return root;
};
