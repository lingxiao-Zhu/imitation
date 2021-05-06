// Definition for singly-linked list.
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 * @description 合并两个升序列表
 */
var mergeTwoLists = function (l1, l2) {
  const dummyHead = new ListNode(null);
  let p = dummyHead;

  while (l1 && l2) {
    if (l1.val > l2.val) {
      p.next = l1;
      l1 = l1.next;
    } else {
      p.next = l2;
      l2 = l2.next;
    }
    p = p.next;
  }

  p.next = l1 ? l1 : l2;

  return dummyHead.next;
};
