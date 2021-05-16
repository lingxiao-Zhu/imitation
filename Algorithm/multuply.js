/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 *
 * @description
 * 给定两个以字符串形式表示的非负整数 num1 和 num2，
 * 返回 num1 和 num2 的乘积，
 * 它们的乘积也表示为字符串形式。
 */
var multiply = function (num1, num2) {
  if (num1 === '0' || num2 === '0') return '0';
  let vals = [];
  for (let i = num1.length - 1; i >= 0; i--) {
    let advance = 0;
    let sum = '';
    for (let j = num2.length - 1; j >= 0; j--) {
      const val = num1[i] * num2[j] + advance;
      advance = Math.floor(val / 10);
      sum = (val % 10) + sum;
    }
    vals.push((advance || '') + sum + new Array(num1.length - i - 1).fill(0).join(''));
  }

  /**
   *
   * @param {string} num1
   * @param {string} num2
   */
  var bigAdd = function (num1, num2) {
    let sum = '';
    let advance = 0;
    const num1Arr = num1.split('');
    const num2Arr = num2.split('');
    while (num1Arr.length > 0 || num2Arr.length > 0) {
      const a = parseInt(num1Arr.pop() || 0);
      const b = parseInt(num2Arr.pop() || 0);
      const total = a + b + advance;
      advance = Math.floor(total / 10);
      sum = (total % 10) + sum;
    }
    return (advance || '') + sum;
  };

  return vals.reduce(bigAdd);
};

/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var multiply2 = function (num1, num2) {
  const len1 = num1.length;
  const len2 = num2.length;
  const arr = new Array(len1 + len2).fill(0);

  for (let i = len1 - 1; i >= 0; i--) {
    for (let j = len2 - 1; j >= 0; j--) {
      const total = num1[i] * num2[j] + arr[i + j + 1];
      arr[i + j] += Math.floor(total / 10); // 十位，这里有个 +=
      arr[i + j + 1] = total % 10; //个位
    }
  }

  while (arr[0] === 0) {
    arr.shift();
  }
  return arr.length ? arr.join('') : '0';
};

console.log(multiply2('123', '456'));
