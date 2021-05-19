function ListNode(val) {
  this.val = val;
  this.next = null;
}

/**
 * @param {ListNode} head
 * @return {boolean}
 * @description 141.环形链表
 */
var hasCycle = function (head) {
  const map = new Map();

  while (head) {
    if (map.has(head)) return true;
    map.set(head, 1);
    head = head.next;
  }
  return false;
};

/**
 * @param {ListNode} head
 * @return {boolean}
 * @description 141.环形链表
 *
 * 快慢指针，看是否碰撞到一起。空间复杂度 O(1)，
 */
var hasCycle2 = function (head) {
  if (!head) return false;

  let slow = head;
  let fast = head;

  while (cur && cur.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
};
