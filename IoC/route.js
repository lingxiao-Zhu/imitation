"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const METHOD_METADATA = 'method';
const PATH_METADATA = 'path';
const isConstructor = (target) => {
    if (isFunction(target)) {
        try {
            const instance = new target();
            return instance.constructor === target;
        }
        catch (e) {
            return false;
        }
    }
    return false;
};
const isFunction = (target) => typeof target === 'function';
const Controller = (path) => {
    return (target) => Reflect.defineMetadata(PATH_METADATA, path, target);
};
const createMappingDecorator = (method) => (path) => {
    return (target, key, descriptor) => {
        Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
        Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value);
    };
};
const Get = createMappingDecorator('GET');
const Post = createMappingDecorator('POST');
let SomeClass = class SomeClass {
    someGetMethod() {
        return 'hello world';
    }
    somePostMethod() { }
};
__decorate([
    Get('/a'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SomeClass.prototype, "someGetMethod", null);
__decorate([
    Post('/b'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SomeClass.prototype, "somePostMethod", null);
SomeClass = __decorate([
    Controller('/test')
], SomeClass);
function mapRoute(instance) {
    const prototype = Object.getPrototypeOf(instance);
    const methodsNames = Object.getOwnPropertyNames(prototype).filter((item) => !isConstructor(prototype[item]) && isFunction(prototype[item]));
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
