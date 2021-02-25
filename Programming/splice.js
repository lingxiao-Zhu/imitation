/**
 * 此方法会改变原数组
 * @param {number} start 修改开始位置，如果是负的，就从末尾还是计算
 * @param {number} deleteCount 移除的个数，如果小于等于0，就不删除
 * @param  {...any} addList 要添加进数组的元素
 * @returns {array} 被删除的子数组
 */
Array.prototype._splice = function (start, deleteCount, ...addList) {
  if (start < 0) start = Math.abs(start) > this.length ? 0 : this.length + start;

  if (deleteCount === undefined) {
    deleteCount = this.length - start;
  } else if (deleteCount <= 0) {
    deleteCount = 0;
  }

  const deleteItems = this.slice(start, start + deleteCount);

  const right = this.slice(start + deleteCount);

  // 新的数组，从被截取的位置开始覆盖
  addList.concat(right).forEach((item) => {
    this[start++] = item;
  });

  // 截取后面重复的数据
  this.length = start;

  return deleteItems;
};
