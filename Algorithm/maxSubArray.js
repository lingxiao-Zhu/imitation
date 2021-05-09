/**
 * @param {number[]} nums
 * @return {number}
 * @description 剑指 Offer 42. 连续子数组的最大和
 *
 * 输入: nums = [-2,1,-3,4,-1,2,1,-5,4]
 * 输出: 6
 * 解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。
 *
 * 要求时间复杂度为O(n)。
 */
var maxSubArray = function (nums) {
  for (let i = 1; i < nums.length; i++) {
    nums[i] = nums[i - 1] >= 0 ? nums[i - 1] + nums[i] : nums[i];
  }
  return nums.sort((a, b) => a - b).pop();
};

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
