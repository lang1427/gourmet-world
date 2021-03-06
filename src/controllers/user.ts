import { Controller, Ctx, Get, Post, RequestParam } from "koa-controllers";
import { Context } from 'koa'
import { Model } from "sequelize/types";
import { Session } from 'koa-session'
const Sequelize = require('sequelize')
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
    public async user(@Ctx ctx: Context, @RequestParam('userid', { required: false }) userid: number) {
        let _userid = userid || (<Session>ctx.session).userID
        const { data, conf } = await this.getUserInfo(ctx, _userid, this.selectType(ctx, 0))
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
        let user_info: Model = await ctx.state.db['users_info'].findByPk(userid, {
            attributes: ['avatar', 'sex']
        })
        let like_count: Model = await ctx.state.db['like'].count({
            where: {
                user_id: userid
            }
        })

        const data = {
            userid,
            username: user.get('username'),
            user_avatar: user_info.get('avatar'),
            user_sex: user_info.get('sex'),
            create_user: formatDate(user.get('createdAt') as Date, 'yyyy-MM-dd'),
            like_count,
            goods_list: [],
            good_num: 0
        }
        const conf = {
            title: `${data.username}???????????????_????????????`,
            keywords: `${data.username},${data.username}???????????????,${data.username}???????????????`,
            description: `????????????????????????${data.username}???????????????????????????${data.username}????????????????????????????????????${data.username}?????????????????????????????????`
        }
        if (type.menus) {

            let goods_list = (<any>user).goods.map((good: Model) => {
                return {
                    good_id: good.get('id'),
                    good_img: good.get('img'),
                    good_name: good.get('g_name'),
                    like_count: good.get('like_count'),
                    ingredients: good.get('zhuliao') + '???' + (good.get('fuliao') ? good.get('fuliao') : '???'),
                    // ?????????????????????=>???????????????  ?????????????????????????????????????????????'2021-01-01 11:11'????????????
                    good_time: (<Date>good.get('createdAt')) ? formatDate((<Date>good.get('createdAt')), 'yyyy-MM-dd hh:mm') : '2021-01-01 11:11'
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

    /** ?????????????????? ???????????????????????????????????????
     * 
     * @param ctx ???????????????
     * @param type ???????????? 0????????????20???   1????????????   2????????????   3????????????
     * @param offset ?????? ?????????
     * @param search_str ???????????????
     * @returns include??????????????????    search_str:???????????????    menus??????????????????   pai??????????????????    log??????????????????
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
                    // ?????????????????? ???????????????
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
        title: '????????????-????????????',
        keywords: "",
        description: ''
    }

    @Get('/user/register')
    public async register(@Ctx ctx: Context) {
        await ctx.render('page/user/register', Object.assign({}, this.conf))
    }

    @Post('/user/register')
    public async register_post(@Ctx ctx: Context) {
        let { username, password } = (<koaBody>ctx.request).body
        if (!!username && !!password) {
            let res = await ctx.state.db['users'].findAll({
                where: {
                    username
                }
            })
            if (res.length > 0) {
                ctx.body = {
                    code: 0,
                    mes: '??????????????????'
                }
            } else {
                let user: Model = ctx.state.db['users'].build({
                    username,
                    password
                })
                let userInfo: Model = ctx.state.db['users_info'].build()
                await user.save()
                await userInfo.save()
                ctx.body = {
                    code: 1,
                    mes: '???????????????'
                }
            }
        } else {
            ctx.body = {
                code: 0,
                mes: '????????????????????????'
            }
        }
    }
}

@Controller
export class Login {

    conf = {
        title: '????????????-????????????',
        keywords: "",
        description: ''
    }

    @Get('/user/login')
    public async Login(@Ctx ctx: Context) {
        await ctx.render('page/user/login', Object.assign({}, this.conf))
    }

    @Post('/user/login')
    public async login_post(@Ctx ctx: Context) {
        let { username, password } = (<koaBody>ctx.request).body
        let res = await ctx.state.db['users'].findAll({
            where: {
                username,
                password
            }
        })
        if (res.length > 0) {
            let user_info: Model = await ctx.state.db['users_info'].findByPk(res[0].get('id'), {
                attributes: ['avatar']
            });
            ctx.cookies.set('avatar', user_info.get('avatar') as string, { signed: false, httpOnly: false, expires: new Date(Date.now() + 86400000) });
            (<Session>ctx.session).userID = res[0].get('id')
            // koa???cookie?????????????????????????????????: ???buffer??????????????????base64??????,???cookie??????????????????buffer????????????
            ctx.cookies.set('username', new Buffer(username).toString('base64'), { signed: false, httpOnly: false, expires: new Date(Date.now() + 86400000) })
            ctx.body = {
                code: 1
            };
        } else {
            ctx.body = {
                code: 0,
                mes: '????????????????????????'
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
        ctx.cookies.set('avatar', '', { signed: false, httpOnly: false, maxAge: 0 })
        //    ??????bug ?????????url ??? /logout ?????????????????????url??????
        // let url = ctx.url
        // if (url.match(/\/user/) != null) {
        if (ctx.request.header['referer']?.match(/\/user/) != null) {
            // ctx.redirect('/user/login')  ???????????????  ?????????????????????  ????????????????????????????????????
            ctx.body = {
                code: 1,
                href: '/user/login'
            }
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
        title: `???????????? - ????????????`,
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
            let { recipe_id } = (<koaBody>ctx.request).body
            if (!!recipe_id) {
                let recipe: Model = await ctx.state.db['goods'].findByPk(recipe_id)
                if (!!recipe) {
                    await recipe.destroy()
                    let step: Model = await ctx.state.db['step'].findByPk(recipe_id)
                    step.destroy()
                    ctx.body = {
                        code: 1,
                        mes: '????????????'
                    }
                } else {
                    ctx.body = {
                        code: 0,
                        mes: '???????????????????????????'
                    }
                }
            } else {
                ctx.body = {
                    code: 0,
                    mes: '????????????'
                }
            }
        } else {
            ctx.body = {
                code: -1,
                mes: "??????????????????????????????"
            }
        }
    }

    /** ???????????????????????????????????????
     * 
     * @param ctx ctx???????????????
     * @param status ?????????????????????
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
                    ingredients: model.get('zhuliao') + '???' + (model.get('fuliao') ? model.get('fuliao') : '???'),
                    good_time: (<Date>model.get('updatedAt')) ? formatDate((<Date>model.get('updatedAt')), 'yyyy-MM-dd hh:mm') : '2021-01-01 11:11',
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
        this.conf.title = '???????????? - ????????????'
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
            let avatar_img: Iupload_res = (<any>(ctx.request as koaBody).files).avatar_img
            let upload_url = ''
            if (!!avatar_img && fs.existsSync(avatar_img.path)) {
                let new_name = `${avatar_img.size}-${avatar_img.hash}-${avatar_img.name}`
                // ???????????????????????? ???????????? ????????????-??????md5-?????????
                fs.renameSync(avatar_img.path, avatar_img.path?.replace(path.basename(avatar_img.path), new_name))
                upload_url = `/public/upload/${create_dirName()}/${new_name}`
            }
            let { sex, province, city } = (<koaBody>ctx.request).body
            let userInfoModel: Model = await ctx.state.db['users_info'].findByPk(user_id)
            await userInfoModel.update({
                avatar: upload_url === '' ? userInfoModel.get('avatar') : upload_url,
                sex,
                birthprovince: province,
                birthcity: city
            })
            ctx.body = {
                code: 1,
                mes: '????????????'
            }
        } else {
            ctx.body = {
                code: -1,
                mes: '??????????????????????????????'
            }
        }
    }

    @Get('/user/my_settings_password')
    public async mySettingPawd(@Ctx ctx: Context) {
        let user_id = (<Session>ctx.session).userID
        this.conf.title = '???????????? - ????????????'
        if (!!user_id) {
            await ctx.render('page/user/settings/change_pawd', Object.assign({}, this.conf, { my_left_val: this.my_left_val }))
        } else {
            ctx.redirect('/user/login')
        }
    }

    @Post('/modify/password')
    public async modifyPawd(@Ctx ctx: Context) {
        let { oldpassword, newpassword } = (<koaBody>ctx.request).body
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
                            mes: '??????????????????'
                        }
                        ctx.session = null
                        ctx.cookies.set('username', '', { signed: false, httpOnly: false, maxAge: 0 })
                        ctx.cookies.set('avatar', '', { signed: false, httpOnly: false, maxAge: 0 })
                    } else {
                        ctx.body = {
                            code: 0,
                            mes: '?????????????????????????????????'
                        }
                    }
                } else {
                    ctx.body = {
                        code: 0,
                        mes: '???????????????'
                    }
                }
            } else {
                ctx.body = {
                    code: 0,
                    mes: "????????????"
                }
            }
        } else {
            ctx.body = {
                code: -1,
                mes: "??????????????????????????????"
            }
        }
    }
}