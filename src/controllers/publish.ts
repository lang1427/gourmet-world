import { Context } from "koa";
import { Controller, Ctx, Get, Post } from "koa-controllers";
import { Session } from "koa-session";
import { Model } from "sequelize/types";

@Controller
export class Publish {
    @Get('/publish/recipe-add')
    public async addRecipe(@Ctx ctx: Context) {
        let user_id = (<Session>ctx.session).userID
        if (!!user_id) {
            const conf = {
                title: '发布新菜谱 - 美食天下',
                keywords: ``,
                description: ''
            }
            await ctx.render('page/publish/add_recipe', Object.assign({}, conf))
        } else {
            ctx.redirect('/user/login/')
        }
    }

    @Post('/publish/recipe-add')
    public async addRecipe_post(@Ctx ctx: Context) {
        let { subject } = ctx.request.body
        let user_id = (<Session>ctx.session).userID
        if (!!user_id) {
            if (!!subject) {
                let new_goods = await ctx.state.db['goods'].build({
                    g_name: subject,
                    user_id
                })
                let res = await new_goods.save()
                // 创建菜谱的同时创建菜谱步骤数据
                let new_step: Model = await ctx.state.db['step'].build({
                    desc: '{"1":"","2":"","3":""}',
                    url: '{"1":"","2":"","3":""}'
                })
                await new_step.save()
                await ctx.redirect('/publish/recipe-edit?goods_id=' + res.id)
            } else {
                await ctx.redirect('/publish/recipe-add')
            }
        } else {
            await ctx.redirect('/user/login/')
        }

    }

    @Get('/publish/recipe-edit')
    public async editRecipe(@Ctx ctx: Context) {
        let recipe_id: number = parseInt((<string>ctx.query['goods_id']))
        let recipe: Model = await ctx.state.db['goods'].findByPk(recipe_id)
        if (!!recipe) {
            const recipe_info = {
                id: recipe.get('id'),
                g_name: recipe.get('g_name'),
                cover_img: recipe.get('img'),
                desc: recipe.get('desc'),
                difficulty: recipe.get('difficulty'),
                zhuliao: recipe.get('zhuliao'),
                fuliao: recipe.get('fuliao'),
                tiaoliao: recipe.get('tiaoliao'),
                step_id: recipe.get('step_id'),
                status: recipe.get('status')
            }
            const conf = {
                title: `编辑菜谱:${recipe_info.g_name} - 美食天下`,
                keywords: ``,
                description: ''
            }
            await ctx.render('page/publish/edit_recipe', Object.assign({}, conf, recipe_info))
        } else {

        }

    }

    @Post('/publish/recipe-edit')
    public async editRecipe_post(@Ctx ctx: Context) {
        let { recipe_id, g_name, desc, difficulty, zhuliao, fuliao, tiaoliao } = ctx.request.body
        let user_id = (<Session>ctx.session).userID
        if (!!user_id) {
            if (!!recipe_id) {
                let RecipeModel: Model = await ctx.state.db['goods'].findByPk(recipe_id)
                if (!!RecipeModel) {
                    await RecipeModel.update({
                        g_name,
                        desc,
                        difficulty,
                        zhuliao,
                        fuliao,
                        tiaoliao
                    })
                    ctx.body = {
                        code: 1,
                        mes: '更新成功'
                    }
                } else {
                    ctx.body = {
                        code: 0,
                        mes: '菜谱不存在'
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

    @Post('/publish/recipe-save')
    public async saveRecipe(@Ctx ctx: Context) {
        let { recipe_id, g_name, desc, difficulty, zhuliao, fuliao, tiaoliao, cover_img, step_desc, step_url, status } = ctx.request.body
        let user_id = (<Session>ctx.session).userID

        if (!!user_id) {
            if (!!recipe_id && !!status) {
                let RecipeModel: Model = await ctx.state.db['goods'].findByPk(recipe_id)
                let StepModel: Model = await ctx.state.db['step'].findByPk(recipe_id)
                if (!!RecipeModel) {
                    switch (parseInt(status)) {
                        case 1:
                            if (!!g_name && !!difficulty && !!zhuliao && !!cover_img && !!step_desc) {
                                await RecipeModel.update({
                                    g_name,
                                    img: cover_img,
                                    desc,
                                    difficulty,
                                    zhuliao,
                                    fuliao,
                                    tiaoliao,
                                    status: 0
                                })
                                await StepModel.update({
                                    desc: step_desc,
                                    url: step_url
                                })
                                ctx.body = {
                                    code: 1,
                                    mes: "发表成功，请耐性等待审核"
                                }
                            } else {
                                ctx.body = {
                                    code: 0,
                                    mes: '菜谱名称，成品图片，主料，制作难度，步骤 不能为空'
                                }
                            }
                            break;
                        case 3:
                            await RecipeModel.update({
                                g_name,
                                img: cover_img,
                                desc,
                                difficulty,
                                zhuliao,
                                fuliao,
                                tiaoliao,
                                status
                            })
                            await StepModel.update({
                                desc: step_desc,
                                url: step_url
                            })
                            ctx.body = {
                                code: 1,
                                mes: '保存草稿成功！'
                            }
                            break;
                        default:
                            ctx.body = {
                                code: 0,
                                mes: '参数status值不被允许'
                            }
                    }
                } else {
                    ctx.body = {
                        code: 0,
                        mes: '菜谱不存在'
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
                mes: '登录超时，请重新登录'
            }
        }
    }
}