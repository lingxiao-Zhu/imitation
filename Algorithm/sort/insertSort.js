const arr = [5, 2, 4, 1, 23, 9, 10, 3];

/**
 * 插入排序
 * 插入排序的代码实现虽然没有冒泡排序和选择排序那么简单粗暴，
 * 但它的原理应该是最容易理解的了，因为只要打过扑克牌的人都应该能够秒懂。
 * 插入排序是一种最简单直观的排序算法，它的工作原理是通过构建有序序列，对于未排序数据，
 * 在已排序序列中从后向前扫描，找到相应位置并插入。
 *
 * 算法步骤
 * 将第一待排序序列第一个元素看做一个有序序列，
 * 把第二个元素到最后一个元素当成是未排序序列。
 * 从头到尾依次扫描未排序序列，将扫描到的每个元素插入有序序列的适当位置。
 *
 * 插入排序和冒泡排序一样，也有一种优化算法，叫做拆半插入。
 * @param {Array<number>} arr
 */
function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let minIdx = i;
    for (let j = i - 1; j >= 0; j--) {
      if (arr[j] > arr[minIdx]) {
        const temp = arr[minIdx];
        arr[minIdx] = arr[j];
        arr[j] = temp;
        minIdx = j;
      }
    }
  }
}

/**
 * 折半插入
 * 折半插入排序的本质依然是插入排序，仅仅是对插入排序进行了部分优化。
 * 而优化的部分就是向前查找比较的部分。
 * 其实它就是将查找从暴力枚举一一遍历变为二分查找。
 * @param {Array<number>} arr
 */
function binaryInsertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let start = 0;
    let middle = start + Math.ceil(i / 2);
    let end = i;

    while (middle - start > 1) {
      if (arr[middle] > arr[i]) {
        end = middle;
      } else {
        start = middle;
      }
      middle = start + Math.ceil((end - start) / 2);
    }

    arr.splice(start, 0, arr[i]);
  }
}

binaryInsertSort(arr);

console.log(arr);
