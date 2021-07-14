import { Context } from "koa";
import { Controller, Ctx, Get, Post } from "koa-controllers";
import { Session } from "koa-session";
import { Model } from "sequelize/types";

@Controller
export class Publish {
    @Get('/publish/recipe-add')
    public async addRecipe(@Ctx ctx: Context) {
        const conf = {
            title: '发布新菜谱 - 美食天下',
            keywords: ``,
            description: ''
        }
        await ctx.render('page/publish/add_recipe', Object.assign({}, conf))
    }

    @Post('/publish/recipe-add')
    public async addRecipe_post(@Ctx ctx: Context) {
        console.log(ctx.request.body)
        let { subject } = ctx.request.body
        if (!!subject) {
            let user_id = (<Session>ctx.session).userID
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
                step_id: recipe.get('step_id')
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
}