const myIterable = {
  [Symbol.iterator]: function* () {
    yield 1;
    yield 2;
    yield 3;
  },
};

const myIterable1 = {
  [Symbol.iterator]: function () {
    const data = [1, 2, 3];
    let idx = 0;
    return {
      next: () => {
        if (idx < data.length) {
          return { value: data[idx++], done: false };
        } else {
          return { done: true };
        }
      },
    };
  },
};
