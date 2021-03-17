const arr = [5, 2, 4, 1, 23, 9, 10, 3];

/**
 * 冒泡
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
