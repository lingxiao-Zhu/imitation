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

// 时间复杂度
/**
 * T(n) = 2(T(n/2)) + cn
 * T(n) = 2(2(T(n/4))) + 2cn
 * T(n) = 2(2(2(T(n/8)))) + 3cn
 * T(n) = 2^k(T(n/2^k)) + kcn
 *
 * n/2^k = 1, n = 2^k，k = logn
 *
 * T(n) = 2^logn(T(1)) + logn * cn // 2^logn = n
 * T(n) = n(T(1)) + logn * cn // 去掉 n(T(1))
 * T(n) = logn * cn // 去掉常量 c
 * T(n) = nlogn // 去掉常量 c
 */
console.log(qSort(arr));
