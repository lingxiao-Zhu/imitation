/**
 * @param {string} version1
 * @param {string} version2
 *
 * @description
 * 时间复杂度 O(N+M+max(N, M))
 * 空间复杂度 O(N+M)，使用了两个数组 arr1 和 arr2 存储两个字符串的块。
 *
 * @return {number}
 */
var compareVersion = function (version1, version2) {
  const arr1 = version1.split('.');
  const arr2 = version2.split('.');

  for (let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
    const a = arr1[i] || 0;
    const b = arr2[i] || 0;
    if (parseInt(a) > parseInt(b)) {
      return 1;
    } else if (parseInt(a) === parseInt(b)) {
      continue;
    } else {
      return -1;
    }
  }

  return 0;
};
