/**
 * 观察者模式
 */
class Observer {
  constructor() {
    this.events = new Set();
  }

  on(fn) {
    this.events.add(fn);
  }

  off(fn) {
    this.events.delete(fn);
  }

  call(...args) {
    for (const fn of _events) {
      fn.apply(null, args);
    }
  }
}

/**
 * 发布订阅模式
 */
class EventListener {
  constructor() {
    this.events = new Map();
  }

  on(event, fn) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set([fn]));
    } else {
      this.events.get(event).add(fn);
    }
  }

  off(event, fn) {
    if (this.events.has(event)) {
      this.events.get(event).delete(fn);
    }
  }

  call(event, ...args) {
    const _events = this.events.get(event);
    if (_events) {
      for (const fn of _events) {
        fn.apply(null, args);
      }
    }
  }
}
