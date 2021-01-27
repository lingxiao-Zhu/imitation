import 'reflect-metadata';

const METHOD_METADATA = 'method';
const PATH_METADATA = 'path';

const isConstructor = (target: any) => {
  if (isFunction(target)) {
    try {
      const instance = new target();
      return instance.constructor === target;
    } catch (e) {
      return false;
    }
  }
  return false;
};
const isFunction = (target: any) => typeof target === 'function';

const Controller = (path: string): ClassDecorator => {
  return (target) => Reflect.defineMetadata(PATH_METADATA, path, target);
};

const createMappingDecorator = (method: string) => (path: string) => {
  return (target: any, key: any, descriptor: any) => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value);
  };
};

const Get = createMappingDecorator('GET');
const Post = createMappingDecorator('POST');

@Controller('/test')
class SomeClass {
  @Get('/a')
  someGetMethod() {
    return 'hello world';
  }

  @Post('/b')
  somePostMethod() {}
}

function mapRoute(instance: Object) {
  const prototype = Object.getPrototypeOf(instance);
  // 筛选出类的 methodName
  const methodsNames = Object.getOwnPropertyNames(prototype).filter(
    (item) => !isConstructor(prototype[item]) && isFunction(prototype[item]),
  );

  return methodsNames.map((methodName) => {
    const fn = prototype[methodName];
    const route = Reflect.getMetadata(PATH_METADATA, fn);
    const method = Reflect.getMetadata(METHOD_METADATA, fn);
    return {
      route,
      method,
      fn,
      methodName,
    };
  });
}

console.log(mapRoute(new SomeClass()));
