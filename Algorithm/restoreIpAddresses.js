/**
 * @param {string} s
 * @return {string[]}
 */
var restoreIpAddresses = function (s) {
  const res = [];

  var helper = function (combine, str) {
    if (!str && combine.length === 4) {
      return res.push(combine);
    }

    if (!str && combine.length !== 4) {
      return;
    }

    let i = 0;
    let num = '';
    while (i < str.length) {
      num += str[i++];
      if (parseInt(num) < 256) {
        helper(combine.concat(num), str.substring(i));
      }
      if (num[0] === '0') break;
    }
  };

  helper([], s);

  return res.map((item) => item.join('.'));
};

console.log(restoreIpAddresses('010010'));
