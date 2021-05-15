class A {
  constructor() {
    this.name = 'Larry';
    this._age = 27;
    Object.defineProperty(this, 'hobby', {
      configurable: false,
      writable: false,
      value: '唱，跳，rap',
    });
  }

  get age() {
    this._age += 1;
    return this._age;
  }

  set age(num) {
    this._age = num;
  }
}

// 生成一个新的实例A
function clone(obj) {
  const desc = Object.getOwnPropertyDescriptors(obj);
  const newObj = {};
  Object.defineProperties(newObj, desc);
  newObj.__proto__ = obj.__proto__; // 链接 getter、setter
  return newObj;
}

var a = new A();

var b = clone(a);

console.log(b.age);
console.log(b.age);
