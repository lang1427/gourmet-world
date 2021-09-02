import { Context } from "koa";
import { Controller, Ctx, Get, Post } from "koa-controllers";
import { Session } from "koa-session";
import { Model } from "sequelize/types";

@Controller
export class Star {
    public my_left_val: number = 5

    @Get('/user/my_star_recipe/:page')
    public async myStarRecipe(@Ctx ctx: Context) {
        let data = {}
        let user_id = (<Session>ctx.session).userID
        if (!!user_id) {
            let { page } = ctx.params
            const conf = {
                title: `我收藏的菜谱 - 美食天下`,
                keywords: ``,
                description: ``
            }
            let total = await ctx.state.db['star'].count({
                where: {
                    user_id
                }
            })
            console.log(total)
            if (total === 0) {

            } else {
                let my_star_recipe = await ctx.state.db['star'].findAll({
                    where: {
                        user_id
                    },
                    limit: 20,
                    offset: (page - 1) * 20,
                    include: [{ model: ctx.state.db['goods'], include: ctx.state.db['users'] }]
                })
                data = my_star_recipe.map((model: Model) => {
                    return {
                        star_id: model.get('id'),
                        recipe_id: model.get('g_id'),
                        recipe_name: (<any>model).good.get('g_name'),
                        recipe_img: (<any>model).good.get('img'),
                        ingredients: (model as any).good.get('zhuliao') + '、' + ((model as any).good.get('fuliao') ? (model as any).good.get('fuliao') : '无'),
                        star_count: (<any>model).good.get('star_count'),
                        recipe_userid: (<any>model).good.get('user_id'),
                        recipe_username: (<any>model).good.user.get('username')
                    }
                })
                console.log(data)
            }
            await ctx.render('page/user/star/my_star_recipe', Object.assign({}, conf, { my_left_val: this.my_left_val, total, data, page }))
        } else {
            ctx.redirect('/user/login')
        }

    }

    @Post('/add_recipe_star')
    public async addRecipeStar(@Ctx ctx: Context) {
        if (!!(<Session>ctx.session).userID) {
            let { g_id } = (<koaBody>ctx.request).body
            if (!!g_id) {
                let is_star = await ctx.state.db['star'].count({
                    where: {
                        g_id,
                        user_id: (<Session>ctx.session).userID
                    }
                })
                if (is_star === 1) {
                    ctx.body = {
                        code: 2,
                        mes: '已收藏'
                    }
                } else {
                    let newStar: Model = ctx.state.db['star'].build({
                        g_id,
                        user_id: (<Session>ctx.session).userID
                    })
                    await newStar.save()
                    let recipe: Model = await ctx.state.db['goods'].findByPk(g_id)
                    await recipe.update({
                        star_count: (<number>recipe.get('star_count')) + 1
                    })
                    ctx.body = {
                        code: 1,
                        mes: '收藏成功'
                    }
                }
            } else {
                ctx.body = {
                    code: 0,
                    mes: '参数错误'
                }
            }
        } else {
            ctx.cookies.set('username', '', { signed: false, httpOnly: false, maxAge: 0 })
            ctx.cookies.set('avatar', '', { signed: false, httpOnly: false, maxAge: 0 })
            ctx.body = {
                code: -1,    // 未登陆
                mes: '您还没有登陆呢，请先登陆后操作'
            }
        }
    }

    @Post('/del_recipe_star')
    public async delRecipeStar(@Ctx ctx: Context) {
        let user_id = (<Session>ctx.session).userID
        if (!!user_id) {
            let { star_id, recipe_id } = (<koaBody>ctx.request).body
            if (!!star_id && !!recipe_id) {
                let starModel: Model = await ctx.state.db['star'].findOne({
                    where: {
                        id: star_id,
                        g_id: recipe_id
                    }
                })
                if (!!starModel) {
                    await starModel.destroy()
                    let recipeModel: Model = await ctx.state.db['goods'].findByPk(recipe_id)
                    await recipeModel.update({
                        star_count: (<number>recipeModel.get('star_count')) - 1
                    })
                    ctx.body = {
                        code: 1,
                        mes: '删除成功'
                    }
                } else {
                    ctx.body = {
                        code: 0,
                        mes: '删除失败：未找到相关收藏的信息'
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
}