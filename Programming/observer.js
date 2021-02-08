class Observer {
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
