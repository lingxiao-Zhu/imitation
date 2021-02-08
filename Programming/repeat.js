/**
 * repeats the string `n` times
 * @param {number}} n
 * @returns {string} returns the repeated string
 */
function repeat(string, n = 0) {
  let result = '';
  if (n < 1 || n > Number.MAX_SAFE_INTEGER) {
    return result;
  }

  do {
    if (n % 2) {
      result += string;
    }
    n = Math.floor(n / 2);
    if (n) {
      string += string;
    }
  } while (n);
  return result;
}
