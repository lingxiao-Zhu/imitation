// 双向链表节点
class ListNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

/**
 * @param {number} capacity
 */
var LRUCache = function (capacity) {
  this.capacity = capacity; // 容量
  this.count = 0; // 已存储的节点数量
  this.dummyHead = new ListNode(); // 虚拟头结点
  this.dummyTail = new ListNode(); // 虚拟尾节点
  this.dummyHead.next = this.dummyTail;
  this.dummyTail.prev = this.dummyHead;
  this.map = {};
};

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function (key) {
  const node = this.map[key];
  if (!node) return -1;
  this.moveToHead(node);
  return node.value;
};

/**
 *
 * @param {ListNode} node
 */
LRUCache.prototype.moveToHead = function (node) {
  this.removeFromList(node);
  this.addToHead(node);
};

LRUCache.prototype.addToHead = function (node) {
  node.prev = this.dummyHead;
  node.next = this.dummyHead.next;
  this.dummyHead.next.prev = node;
  this.dummyHead.next = node;
};

/**
 * 如果关键字已经存在，则变更其数据值；如果关键字不存在，则插入该组「关键字-值」。
 * 当缓存容量达到上限时，它应该在写入新数据之前删除最久未使用的数据值，
 * 从而为新的数据值留出空间。
 * @param {number} key
 * @param {number} value
 * @return {void}
 */

LRUCache.prototype.put = function (key, value) {
  const node = this.map[key];
  if (!node) {
    if (this.count === this.capacity) this.removeLRUItem();
    const newNode = new ListNode(key, value);
    this.map[key] = newNode;
    this.addToHead(newNode);
    this.count++;
  } else {
    node.value = value;
    this.moveToHead(node);
  }
};

LRUCache.prototype.removeLRUItem = function () {
  let tail = this.dummyTail.prev;
  this.removeFromList(tail);
  delete this.map[tail.key];
  this.count--;
};

LRUCache.prototype.removeFromList = function (node) {
  let temp1 = node.prev;
  let temp2 = node.next;
  temp1.next = temp2;
  temp2.prev = temp1;
};
