"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const koa_1 = __importDefault(require("koa"));
const koa_controllers_1 = require("koa-controllers");
const koa_views_1 = __importDefault(require("koa-views")); // 模板渲染中间件 
const koa_static_cache_1 = __importDefault(require("koa-static-cache")); // 静态资源文件处理
const app = new koa_1.default();
app.use(koa_static_cache_1.default(path.join(__dirname, 'static'), {
    prefix: '/public',
    gzip: true
}));
const render = koa_views_1.default(__dirname + '/view', {
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
