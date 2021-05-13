// 数组去重
const a = [1, 1, 2, 2, 3, 4, 5, 5, 6];

// 1.Set
function method1(arr) {
  return Array.from(new Set([...arr]));
}

/**
 * 通过for循环+map缓存数据
 * @param {Array} arr
 */
function method2(arr) {
  const map = {};
  const newArr = [];

  for (let i of arr) {
    if (!map[i]) {
      map[i] = 1;
      newArr.push(i);
    }
  }
  return newArr;
}

/**
 * 排序后，相邻元素对比跳过
 * @param {Array} arr
 */
function method3(arr) {
  const newArr = [];
  arr.sort((a, b) => a - b);
  let i = 0;
  while (i < arr.length - 1) {
    if (arr[i] !== arr[i + 1]) {
      newArr.push(arr[i]);
    }
    i++;
  }
  return newArr;
}
