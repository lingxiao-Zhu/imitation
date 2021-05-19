/**
 * @param {string} s
 * @return {number}
 * @description 3.无重复字符的最长子串
 */
var lengthOfLongestSubstring = function (s) {
  if (s === '') return 0;
  let maxLen = 1;
  let str = '';
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (str.indexOf(char) > -1) {
      str = str.slice(str.indexOf(char) + 1);
    }
    str += s[i];
    maxLen = Math.max(maxLen, str.length);
  }
  return maxLen;
};
