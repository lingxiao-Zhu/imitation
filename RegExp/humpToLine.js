const str = 'you_are_my_lover';

/**
 * 下划线转驼峰
 * @param {string} str
 * @returns
 */
function lineToHump(str) {
  return str.replace(/_(\w)/g, function (subStr, letter) {
    return letter.toUpperCase();
  });
}

/**
 * 驼峰转下划线
 * @param {string} str
 */
function humpToLine(str) {
  return str.replace(/\B([A-Z])/g, '_$1').toLowerCase();
}

console.log(humpToLine('youAreMyLover'));
