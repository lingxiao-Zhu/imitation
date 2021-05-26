/**
 * 回文字符串：中间扩散法
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
  if (s.length < 2) return s;

  let res = '';

  for (let i = 0; i < s.length; i++) {
    helper(i, i);
    helper(i, i + 1);
  }

  function helper(m, n) {
    while (s[m] === s[n] && m >= 0 && n < s.length) {
      m--;
      n++;
    }
    if (n - m - 1 > res.length) {
      res = s.substring(m + 1, n);
    }
  }

  return res;
};
