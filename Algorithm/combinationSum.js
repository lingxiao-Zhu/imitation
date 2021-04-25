/**
 * 给定一个无重复元素的数组 candidates 和一个目标数 target ，
 * 找出 candidates 中所有可以使数字和为 target 的组合。
 *
 * 说明：
 * candidates 中的数字可以无限制重复被选取。
 * 所有数字（包括 target）都是正整数。
 * 解集不能包含重复的组合。
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function (candidates, target) {
  const res = [];

  const dfs = (target, combine, idx) => {
    if (target < 0) {
      return;
    }

    if (target === 0) {
      res.push(combine.slice());
      return;
    }

    for (let i = idx; i < candidates.length; i++) {
      const value = candidates[i];
      dfs(target - value, [...combine, value], i);
    }
  };

  dfs(target, [], 0);

  return res;
};

console.log(combinationSum([2, 3, 5], 8));
