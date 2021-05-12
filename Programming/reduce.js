Array.prototype.myReduce = function (fn, initial) {
  var tmp = this.slice();
  var initialValue = initial === undefined ? tmp.shift() : initial;

  tmp.forEach((value, idx) => {
    initialValue = fn(initialValue, value, idx, this);
  });

  return initialValue;
};

// test
const sum = [1, 2, 3, 4].myReduce(function (prev, next, currentIndex, array) {
  return prev + next;
});
console.log(sum); // 10

const sum1 = [1, 2, 3, 4].myReduce(function (prev, next, currentIndex, array) {
  return prev + next;
}, 10);
console.log(20); // 10
