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
const Injectable = () => () => { };
class OtherService {
    constructor() {
        this.a = 1;
    }
}
let TestService = class TestService {
    constructor(otherService) {
        this.otherService = otherService;
    }
    testMethod() {
        console.log(this.otherService.a);
    }
};
TestService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [OtherService])
], TestService);
const Factory = (target) => {
    const providers = Reflect.getMetadata('design:paramtypes', target);
    const args = providers.map((provider) => new provider());
    return new target(...args);
};
console.log(Factory(TestService).testMethod());
