/**
 * @param {number[]} nums
 * @return {number[][]}
 *
 * @description
 * 给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，
 * 使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。
 */
var threeSum = function (nums) {
  let res = [];

  // 排序
  nums.sort((a, b) => a - b);

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === nums[i - 1]) continue;
    if (nums[i] > 0) return res;
    let p = i + 1;
    let q = nums.length - 1;
    while (p < q) {
      const sum = nums[i] + nums[p] + nums[q];
      if (sum > 0) q--;
      if (sum < 0) p++;
      if (sum === 0) {
        res.push([nums[i], nums[p], nums[q]]);
        while (p < q && nums[p] === nums[p + 1]) {
          p++;
        }
        while (p < q && nums[q] === nums[q - 1]) {
          q--;
        }
        // 终止的时候，p、q都是旧值，需要移动
        p++;
        q--;
      }
    }
  }

  return res;
};
