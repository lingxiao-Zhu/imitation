const arr = [5, 2, 4, 1, 23, 9, 10, 3];

/**
 * 快速排序
 *
 *
 * 算法步骤
 * 1.从数列中挑出一个元素，称为 "基准"（pivot）;
 * 2.将小于基准的值放入一个组，大于的放到另外一个组。
 * 3.递归重复两个组
 *
 *
 * @param {Array<number>} list
 */
function qSort(list) {
  if (list.length == 0) {
    return [];
  }
  const lesser = [];
  const greater = [];
  const pivot = list[0];
  for (let i = 1; i < list.length; i++) {
    if (list[i] < pivot) {
      lesser.push(list[i]);
    } else {
      greater.push(list[i]);
    }
  }
  return qSort(lesser).concat(pivot, qSort(greater));
}

console.log(qSort(arr));
