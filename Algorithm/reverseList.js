function ListNode(val) {
  this.val = val;
  this.next = null;
}

/**
 * @param {ListNode} head
 * @return {ListNode}
 * @description 206.反转链表
 */
var reverseList = function (head) {
  if (!head || !head.next) return head;
  const prev = head.next;
  const next = reverseList(prev);
  head.next = null;
  prev.next = head;
  return next;
};
