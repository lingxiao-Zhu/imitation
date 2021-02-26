/**
 * 魔术师手中有一堆扑克牌，观众不知道它的顺序，接下来魔术师：
 * 从牌顶拿出一张牌， 放到桌子上
 * 再从牌顶拿一张牌， 放在手上牌的底部
 * 如此往复（不断重复以上两步），直到魔术师手上的牌全部都放到了桌子上。
 * @param {Array<any>} arr
 */
function cards(arr) {
  if (arr.length <= 2) return arr;

  const newArr = [];

  while (arr.length) {
    newArr.unshift(arr.pop());
    const len = newArr.length;
    if (len > 2) {
      const temp = newArr[len - 1];
      newArr.splice(1, 0, temp);
      newArr.length = len;
    }
  }

  return newArr;
}

/**
 * 123 =》 132
 * 1234 =》 1324
 * 12345 =》 13542
 * 123456 =》135264
 */
