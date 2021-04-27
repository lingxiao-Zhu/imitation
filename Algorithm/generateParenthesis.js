/**
 * @description
 * leetcode22 括号生成
 *
 * @example
 * 输入：n = 3
 * 输出：["((()))","(()())","(())()","()(())","()()()"]
 *
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function (n) {
  const res = [];

  const dfs = (lRemain, rRemain, str) => {
    // 左右括号所剩的数量，str是当前构建的字符串
    if (str.length == 2 * n) {
      // 字符串构建完成
      res.push(str); // 加入解集
      return; // 结束当前递归分支
    }
    // 选左
    if (lRemain > 0) {
      dfs(lRemain - 1, rRemain, str + '(');
    }
    // 选右
    if (lRemain < rRemain) {
      dfs(lRemain, rRemain - 1, str + ')'); // 然后继续做选择（递归）
    }
  };

  dfs(n, n, ''); // 递归的入口，剩余数量都是n，初始字符串是空串
  return res;
};
