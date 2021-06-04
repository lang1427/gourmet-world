import { Controller, Ctx, Get, Post } from "koa-controllers";
import { Context } from 'koa'
import { Model } from "sequelize/types";
import { Session } from 'koa-session'


const conf = {
    title: '用户注册-美食天下',
    keywords: "",
    description: ''
}

@Controller
export class Register {
    @Get('/user/register')
    public async register(@Ctx ctx: Context) {
        await ctx.render('page/user/register', Object.assign({}, conf))
    }

    @Post('/user/register')
    public async register_post(@Ctx ctx: Context) {
        let { username, password } = ctx.request.body
        if (!!username && !!password) {
            let res = await ctx.state.db['users'].findAll({
                where: {
                    username
                }
            })
            if (res.length > 0) {
                ctx.body = {
                    code: 0,
                    mes: '用户名已存在'
                }
            } else {
                let user: Model = ctx.state.db['users'].build({
                    username,
                    password
                })
                await user.save()
                ctx.body = {
                    code: 1,
                    mes: '注册成功！'
                }
            }
        } else {
            ctx.body = {
                code: 0,
                mes: '用户名或密码为空'
            }
        }
    }
}


@Controller
export class Login {
    @Get('/user/login')
    public async Login(@Ctx ctx: Context) {
        await ctx.render('page/user/login', Object.assign({}, conf, { title: '用户登录-美食天下' }))
    }

    @Post('/user/login')
    public async login_post(@Ctx ctx: Context) {
        let { username, password } = ctx.request.body
        let res = await ctx.state.db['users'].findAll({
            where: {
                username,
                password
            }
        })
        if (res.length > 0) {
            (<Session>ctx.session).userID = res[0].get('id')
            ctx.cookies.set('username', username, { signed: false, httpOnly: false, maxAge: 900000 })
            ctx.body = {
                code: 1
            };
        } else {
            ctx.body = {
                code: 0,
                mes: '用户名或密码错误'
            }
        }
    }
}

@Controller
export class Logout {
    @Post('/logout')
    public async Logout(@Ctx ctx: Context) {
        ctx.session = null
        ctx.cookies.set('username', '', { signed: false, httpOnly: false, maxAge: 0 })
        let url = ctx.url
        if (url === ('/my_fav_recipe' || '/my_manage' || '/my_privately_list' || '/my_notice_list')) {
            ctx.redirect('/user/login/')
        } else {
            ctx.body = {
                code: 1
            }
        }

    }
}