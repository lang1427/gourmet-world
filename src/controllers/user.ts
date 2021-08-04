import { Controller, Ctx, Get, Post, RequestParam } from "koa-controllers";
import { Context } from 'koa'
import { Model } from "sequelize/types";
import { Session } from 'koa-session'
import Sequelize from 'sequelize'
import { formatDate } from '../utils/formatDate'
import create_dirName from '../utils/create_dirName'
const fs = require('fs')
const path = require('path')

interface ISelectTypeObj {
    include: object
    search_str: string | undefined
    menus: boolean
    pai: boolean
    log: boolean
}

interface Iupload_res {
    size?: number
    path?: string
    name?: string
    type?: string
    mtime?: string
    hash?: string
}

@Controller
export class User {
    @Get('/user')
    public async user(@Ctx ctx: Context, @RequestParam('userid') userid: number) {
        const { data, conf } = await this.getUserInfo(ctx, userid, this.selectType(ctx, 0))
        await ctx.render('page/user/index', Object.assign({}, data, conf))
    }

    @Get('/user/menu-page/:page')
    public async userMenu(@Ctx ctx: Context, @RequestParam('userid') userid: number, @RequestParam('search', { required: false }) search_str?: string) {
        const { page } = ctx.params
        const { data, conf } = await this.getUserInfo(ctx, userid, this.selectType(ctx, 1, page, search_str))
        await ctx.render('page/user/menu', Object.assign({}, data, conf, { page, search_str }))
    }

    public async getUserInfo(ctx: Context, userid: number, type: ISelectTypeObj) {

        let user: Model = await ctx.state.db['users'].findByPk(userid, type.include)
        let like_count: Model = await ctx.state.db['like'].count({
            where: {
                user_id: userid
            }
        })

        const data = {
            userid,
            username: user.get('username'),
            create_user: formatDate(user.get('createdAt') as Date, 'yyyy-MM-dd'),
            like_count,
            goods_list: [],
            good_num: 0
        }
        const conf = {
            title: `${data.username}的个人主页_美食天下`,
            keywords: `${data.username},${data.username}的个人主页,${data.username}的美食博客`,
            description: `欢迎来到美食天下${data.username}的个人主页，这里有${data.username}的原创菜谱、美食照片，及${data.username}所喜爱的各种美食相关。`
        }
        if (type.menus) {
            let goods_list = (<any>user).goods.map((good: Model) => {
                return {
                    good_id: good.get('id'),
                    good_img: good.get('img'),
                    good_name: good.get('g_name'),
                    like_count: good.get('like_count'),
                    ingredients: good.get('zhuliao') + '、' + (good.get('fuliao') ? good.get('fuliao') : '无'),
                    // 获取当前数据表=>菜谱的时间  伪造数据没有创建时间统一指定为'2021-01-01 11:11'这个日期
                    good_time: Number.isNaN((<Date>good.get('createdAt')).getTime()) ? '2021-01-01 11:11' : formatDate((<Date>good.get('createdAt')), 'yyyy-MM-dd hh:mm')
                }
            })
            let good_len: number = await ctx.state.db['goods'].count({
                where: {
                    user_id: userid,
                    status: 1,
                    g_name: {
                        [Sequelize.Op.like]: `%${type.search_str ? type.search_str : ''}%`
                    }
                }
            })

            data.goods_list = goods_list
            data.good_num = good_len
        }
        return {
            data,
            conf
        }
    }

    /** 查询数据类型 （查菜谱，查话题，查日志）
     * 
     * @param ctx 上下文对象
     * @param type 类型判断 0：查所有20条   1：查菜谱   2：查话题   3：查日志
     * @param offset 页码 偏移量
     * @param search_str 查询字符串
     * @returns include：用户关联表    search_str:查询字符串    menus：是否查菜谱   pai：是否查话题    log：是否查日志
     */
    public selectType(ctx: Context, type: number, offset?: number, search_str?: string): ISelectTypeObj {
        const limitCount = 10
        let selectData: ISelectTypeObj = {
            include: {},
            search_str,
            menus: true,
            pai: true,
            log: true
        }
        switch (type) {
            case 0:
                selectData['include'] = {
                    // 后面加上话题 日志。。。
                    include: [{
                        model: ctx.state.db['goods'],
                        where: {
                            status: 1
                        },
                        limit: limitCount
                    }]
                }
                break;
            case 1:
                selectData['include'] = {
                    include: [{
                        model: ctx.state.db['goods'],
                        where: {
                            g_name: {
                                [Sequelize.Op.like]: `%${search_str ? search_str : ''}%`
                            },
                            status: 1
                        },
                        limit: limitCount,
                        offset: ((<number>offset) - 1) * limitCount
                    }]
                }
                selectData['pai'] = false
                selectData['log'] = false
                break;
            case 2:
                break;
            case 3:
                break;
        }
        return selectData
    }
}

@Controller
export class Register {

    conf = {
        title: '用户注册-美食天下',
        keywords: "",
        description: ''
    }

    @Get('/user/register')
    public async register(@Ctx ctx: Context) {
        await ctx.render('page/user/register', Object.assign({}, this.conf))
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

    conf = {
        title: '用户登录-美食天下',
        keywords: "",
        description: ''
    }

    @Get('/user/login')
    public async Login(@Ctx ctx: Context) {
        await ctx.render('page/user/login', Object.assign({}, this.conf))
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
            // koa中cookie不能存放中文的解决办法: 用buffer将中文转换为base64编码,从cookie获取时，再用buffer转换回来
            ctx.cookies.set('username', new Buffer(username).toString('base64'), { signed: false, httpOnly: false, expires: new Date(Date.now() + 86400000) })
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

@Controller
export class UserRecipe {
    public my_left_val: number = 1
    public limitCount: number = 10
    public _total: number = 0
    public conf = {
        title: `我的菜谱 - 美食天下`,
        keywords: ``,
        description: ``
    }

    @Get('/user/my_recipe/:page')
    public async myRecipe(@Ctx ctx: Context, @RequestParam('recipename', { required: false }) recipe_name?: string) {
        const data = await this._getRecipe(ctx, 1, recipe_name ? recipe_name : '')
        if (!!data) {
            await ctx.render('page/user/recipe/my_recipe', Object.assign({}, this.conf, data, { my_left_val: this.my_left_val }))
        } else {
            ctx.redirect('/user/login')
        }
    }

    @Get('/user/my_recipe_pending/:page')
    public async myRecipePending(@Ctx ctx: Context) {
        const data = await this._getRecipe(ctx, 0)
        if (!!data) {
            await ctx.render('page/user/recipe/my_recipe', Object.assign({}, this.conf, data, { my_left_val: this.my_left_val }))
        } else {
            ctx.redirect('/user/login')
        }
    }

    @Get('/user/my_recipe_fail/:page')
    public async myRecipeFail(@Ctx ctx: Context) {
        const data = await this._getRecipe(ctx, 2)
        if (!!data) {
            await ctx.render('page/user/recipe/my_recipe', Object.assign({}, this.conf, data, { my_left_val: this.my_left_val }))
        } else {
            ctx.redirect('/user/login')
        }
    }

    @Get('/user/my_recipe_draft/:page')
    public async myRecipeDraft(@Ctx ctx: Context) {
        const data = await this._getRecipe(ctx, 3)
        if (!!data) {
            await ctx.render('page/user/recipe/my_recipe', Object.assign({}, this.conf, data, { my_left_val: this.my_left_val }))
        } else {
            ctx.redirect('/user/login')
        }
    }

    @Post('/del/recipe')
    public async delRecipe(@Ctx ctx: Context) {
        let user_id = (<Session>ctx.session).userID
        if (!!user_id) {
            let { recipe_id } = ctx.request.body
            if (!!recipe_id) {
                let recipe: Model = await ctx.state.db['goods'].findByPk(recipe_id)
                if (!!recipe) {
                    await recipe.destroy()
                    let step: Model = await ctx.state.db['step'].findByPk(recipe_id)
                    step.destroy()
                    ctx.body = {
                        code: 1,
                        mes: '删除成功'
                    }
                } else {
                    ctx.body = {
                        code: 0,
                        mes: '没有找到该菜谱信息'
                    }
                }
            } else {
                ctx.body = {
                    code: 0,
                    mes: '参数错误'
                }
            }
        } else {
            ctx.body = {
                code: -1,
                mes: "登录超时，请重新登录"
            }
        }
    }

    /** 获取当前登录用户的菜谱数据
     * 
     * @param ctx ctx上下文对象
     * @param status 菜谱当前的状态
     */
    private async _getRecipe(@Ctx ctx: Context, status: number, search_name: string = ''): Promise<void | object> {
        let user_id = (<Session>ctx.session).userID
        let { page } = ctx.params
        if (!!user_id) {
            let recipe_list = await ctx.state.db['goods'].findAll({
                where: {
                    user_id,
                    status,
                    g_name: {
                        [Sequelize.Op.like]: `%${search_name}%`
                    }
                },
                limit: this.limitCount,
                offset: (page - 1) * this.limitCount,
                order: [
                    ['updatedAt', 'desc']
                ],
                attributes: ['id', 'g_name', 'img', 'zhuliao', 'fuliao', 'updatedAt', 'status_mes'],
            })
            let list = recipe_list.map((model: Model) => {
                return {
                    recipe_id: model.get('id'),
                    recipe_name: model.get('g_name'),
                    recipe_cover: model.get('img'),
                    ingredients: model.get('zhuliao') + '、' + (model.get('fuliao') ? model.get('fuliao') : '无'),
                    good_time: Number.isNaN((<Date>model.get('updatedAt')).getTime()) ? '2021-01-01 11:11' : formatDate((<Date>model.get('updatedAt')), 'yyyy-MM-dd hh:mm'),
                    status_mes: model.get('status_mes')
                }
            })
            const data = {
                list,
                page,
                total: list.length
            }
            if (page == 1) {
                this._total = await ctx.state.db['goods'].count({
                    where: {
                        user_id,
                        status,
                        g_name: {
                            [Sequelize.Op.like]: `%${search_name}%`
                        }
                    },
                })
            }
            data.total = this._total
            return data
        }
    }
}

@Controller
export class UserSetting {
    public my_left_val: number = 6
    public conf = {
        title: ``,
        keywords: ``,
        description: ``
    }

    @Get('/user/my_settings_profile')
    public async mySettingProfile(@Ctx ctx: Context) {
        let user_id = (<Session>ctx.session).userID
        this.conf.title = '个人资料 - 美食天下'
        if (!!user_id) {
            let userInfo: Model = await ctx.state.db['users_info'].findByPk(user_id)
            let data = {
                avatar: userInfo.get('avatar'),
                sex: userInfo.get('sex'),
                birthprovince: userInfo.get('birthprovince'),
                birthcity: userInfo.get('birthcity')
            }
            await ctx.render('page/user/settings/profile', Object.assign({}, this.conf, data, { my_left_val: this.my_left_val }))
        } else {
            ctx.redirect('/user/login')
        }
    }

    @Post('/change/my_settings_profile')
    public async changeProfile(@Ctx ctx: Context) {
        let user_id = (<Session>ctx.session).userID
        if (!!user_id) {
            let avatar_img: Iupload_res = (<any>ctx.request.files).avatar_img
            let upload_url = ''
            if (!!avatar_img && fs.existsSync(avatar_img.path)) {
                let new_name = `${avatar_img.size}-${avatar_img.hash}-${avatar_img.name}`
                // 将上传过来的文件 重命名为 文件大小-文件md5-文件名
                fs.renameSync(avatar_img.path, avatar_img.path?.replace(path.basename(avatar_img.path), new_name))
                upload_url = `/public/upload/${create_dirName()}/${new_name}`
            }
            let { sex, province, city } = ctx.request.body
            let userInfoModel: Model = await ctx.state.db['users_info'].findByPk(user_id)
            await userInfoModel.update({
                avatar: upload_url === '' ? userInfoModel.get('avatar') : upload_url,
                sex,
                birthprovince: province,
                birthcity: city
            })
            ctx.body = {
                code: 1,
                mes: '更改成功'
            }
        } else {
            ctx.body = {
                code: -1,
                mes: '登录超时，请重新登录'
            }
        }
    }

    @Get('/user/my_settings_password')
    public async mySettingPawd(@Ctx ctx: Context) {
        let user_id = (<Session>ctx.session).userID
        this.conf.title = '修改密码 - 美食天下'
        if (!!user_id) {
            await ctx.render('page/user/settings/change_pawd', Object.assign({}, this.conf, { my_left_val: this.my_left_val }))
        } else {
            ctx.redirect('/user/login')
        }
    }

    @Post('/modify/password')
    public async modifyPawd(@Ctx ctx: Context) {
        let { oldpassword, newpassword } = ctx.request.body
        let user_id = (<Session>ctx.session).userID
        if (!!user_id) {
            if (!!oldpassword && !!newpassword) {
                let user: Model = await ctx.state.db['users'].findByPk(user_id, {
                    attributes: {
                        include: ['password']
                    }
                })
                if (user.get('password') == oldpassword) {
                    if (oldpassword !== newpassword) {
                        await user.update({
                            password: newpassword
                        })
                        ctx.body = {
                            code: 1,
                            mes: '更改密码成功'
                        }
                        ctx.session = null
                        ctx.cookies.set('username', '', { signed: false, httpOnly: false, maxAge: 0 })
                    } else {
                        ctx.body = {
                            code: 0,
                            mes: '原密码不能和新密码一致'
                        }
                    }
                } else {
                    ctx.body = {
                        code: 0,
                        mes: '原密码错误'
                    }
                }
            } else {
                ctx.body = {
                    code: 0,
                    mes: "参数错误"
                }
            }
        } else {
            ctx.body = {
                code: -1,
                mes: "登录超时，请重新登录"
            }
        }
    }
}