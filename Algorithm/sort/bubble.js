const arr = [5, 2, 4, 1, 23, 9, 10, 3];

/**
 * 冒泡排序（Bubble Sort）也是一种简单直观的排序算法。
 * 它重复地走访过要排序的数列，一次比较两个元素，
 * 如果他们的顺序错误就把他们交换过来。
 * 走访数列的工作是重复地进行直到没有再需要交换，
 * 也就是说该数列已经排序完成。
 * 这个算法的名字由来是因为越小的元素会经由交换慢慢"浮"到数列的顶端。
 *
 * 冒泡排序还有一种优化算法，就是立一个 flag，当在一趟序列遍历中元素没有发生交换，则证明该序列已经有序
 * @param {Array<number>} arr
 */
function bubbleSort(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      const compare = arr[j];
      const next = arr[j + 1];
      if (compare > next) {
        arr[j + 1] = compare;
        arr[j] = next;
      }
    }
  }
}

bubbleSort(arr);

console.log(arr);
