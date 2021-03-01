// Partial<T>
type _Partial<T> = {
  [P in keyof T]?: T[P];
};

// 将类型 T 的所有属性标记为必选属性
type _Required<T> = {
  [P in keyof T]-?: T[P];
};

// 将所有属性标记为 readonly, 即不能修改
type _Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// 从 T 中找出K
type _Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// 从 T 中剔除K，和 Pick 相反
type _Omit<T, K extends keyof T> = _Pick<T, _Exclude<keyof T, K>>;

// 移除 T 中的 U 属性, extends 三元表达式可以得到交集和差集，第一个参数交集，第二个差集
type _Exclude<T, U> = T extends U ? never : T;

// Exclude 的反操作，取 T，U两者的交集属性
type _Extract<T, U> = T extends U ? T : never;

// 获取一个函数的所有参数类型
type _Parameters<T> = T extends (...args: infer U) => any ? U : T;

// 获取函数类型 T 的返回类型
type _ReturnType<T> = T extends (...args: any) => infer R ? R : T;
