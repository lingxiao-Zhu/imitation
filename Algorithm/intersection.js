/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 *
 * @description 349.两个数组的交集
 *
 * 输出结果中的每个元素一定是唯一的。
 */
var intersection = function (nums1, nums2) {
  //   const res = [];
  //   for (let val of nums1) {
  //     if (nums2.indexOf(val) !== -1 && res.indexOf(val) === -1) {
  //       res.push(val);
  //     }
  //   }
  //   return res;

  return [...new Set(nums1)].filter((val) => nums2.includes(val));
};
