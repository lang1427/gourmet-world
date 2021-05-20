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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Index = void 0;
const koa_controllers_1 = require("koa-controllers");
const conf = {
    title: '美食天下_原创菜谱与美食生活社区，我所有的朋友都是吃货！',
    keywords: "美食,菜谱,烹饪,家常菜谱大全,美食网,美食天下",
    description: '美食天下是最大的中文美食网站与厨艺交流社区，拥有海量的优质原创美食菜谱，聚集超千万美食家。我所有的朋友都是吃货，欢迎您加入！'
};
const db = require('../models');
let Index = class Index {
    index(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            // ctx.body = 'hello';
            let data = yield db.goods.findAll();
            ctx.body = data;
        });
    }
};
__decorate([
    koa_controllers_1.Get('/') // 当通过get请求/时 则进入到下面这个方法中
    ,
    __param(0, koa_controllers_1.Ctx),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Index.prototype, "index", null);
Index = __decorate([
    koa_controllers_1.Controller
], Index);
exports.Index = Index;
let User = class User {
    user(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.render('index', Object.assign({}, conf));
        });
    }
};
__decorate([
    koa_controllers_1.Get('/user') // 当通过get请求/时 则进入到下面这个方法中
    ,
    __param(0, koa_controllers_1.Ctx),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], User.prototype, "user", null);
User = __decorate([
    koa_controllers_1.Controller
], User);
exports.User = User;
