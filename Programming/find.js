var obj = {
  a: {
    b: {
      c: 1,
    },
  },
};

/**
 *
 * @param {*} obj
 * @param {string} reg
 * @example
 * find(obj,'a.d.c') //undefined
 * find(obj,'a.b.c') //1
 */
function find(obj, reg) {
  const keys = reg.split('.');
  let key = keys.shift();
  let value = obj[key];

  while (value && keys.length) {
    key = keys.shift();
    value = value[key];
  }

  return value;
}

console.log(find(obj, 'a.b.c'));
