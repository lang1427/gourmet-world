import { Controller, Ctx, Get } from "koa-controllers";
import { Context } from 'koa'
@Controller
export class Index {
    @Get('/')     // 当通过get请求/时 则进入到下面这个方法中
    public async index(@Ctx ctx: Context) {
        ctx.body = 'hello';
    }
}

@Controller
export class User {
    @Get('/user')     // 当通过get请求/时 则进入到下面这个方法中
    public async user(@Ctx ctx: Context) {
        await ctx.render('index', { title: 'hello world' })
    }
}