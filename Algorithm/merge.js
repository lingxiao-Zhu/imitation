/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 * @description 88.合并两个有序数组
 */
var merge = function (nums1, m, nums2, n) {
  let p1 = m - 1;
  let p2 = n - 1;
  let tail = m + n - 1;

  while (p1 >= 0 && p2 >= 0) {
    if (nums1[p1] > nums2[p2]) {
      nums1[tail] = nums1[p1--];
    } else {
      nums1[tail] = nums2[p2--];
    }
    console.log(tail);
    tail--;
  }

  while (p2 >= 0) {
    nums1[tail--] = nums2[p2--];
  }
  return nums1;
};

console.log(merge([0], 0, [1], 1));
