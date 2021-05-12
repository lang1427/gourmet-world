"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_1 = __importDefault(require("koa"));
var koa_controllers_1 = require("koa-controllers");
var koa_views_1 = __importDefault(require("koa-views")); // 模板渲染中间件 
var app = new koa_1.default();
var render = koa_views_1.default(__dirname + '/view', {
    extension: 'ejs' // 省略后缀名
});
app.use(render);
// 配置所有的控制层（路由规则）： 即会读取当前文件夹 controllers 下所有的文件作为路由规则
koa_controllers_1.useControllers(app, __dirname + '/controllers/**/*.js', {
    multipart: {
        dest: './uploads'
    }
});
app.listen(8888);
