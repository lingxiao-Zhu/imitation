/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @description 链表的中间节点
 * @return {ListNode}
 */
var middleNode = function (head) {
  let ptr = new ListNode();
  ptr.next = head;
  let fast = ptr,
    slow = ptr;
  while (fast !== null) {
    if (slow) slow = slow.next;
    if (fast) fast = fast.next;
    if (fast) fast = fast.next;
  }
  return slow;
};
