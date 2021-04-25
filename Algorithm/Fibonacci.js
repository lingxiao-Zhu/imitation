/**
 * 斐波那契数列，递归
 * 时间复杂度 O(2^n)
 * @param {number} n
 */
function Fibonacci1(n) {
  if (n <= 1) return n;
  return Fibonacci1(n - 1) + Fibonacci1(n - 2);
}

/**
 * 斐波那契数列，空间优化
 * 时间复杂度 O(n)
 * @param {number} n
 */
function Fibonacci2(n, cache = {}) {
  if (n <= 1) return n;

  function helper(key) {
    let value = cache[key];
    if (value) return value;
    value = Fibonacci2(key, cache);
    cache[key] = value;
    return value;
  }

  return helper(n - 1) + helper(n - 2);
}

/**
 * 斐波那契数列，dp
 * 时间复杂度 O(n)
 * @param {number} n
 */
function Fibonacci3(n) {
  let a = 0;
  let b = 1;

  let i = 2;

  while (i <= n) {
    i++;
    let tmp = a;
    a = b;
    b = tmp + b;
  }

  return b;
}
