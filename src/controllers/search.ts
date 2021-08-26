import { Context } from "koa";
import { Controller, Ctx, Get } from "koa-controllers";
import { Model } from 'sequelize'
const Sequelize = require('sequelize')

@Controller
export class Search {
    public limitCount = 20
    public _total = 0

    // 动态路由方式匹配搜索内容
    @Get('/search')
    public async search(@Ctx ctx: Context) {
        const conf = {
            title: `美食搜索_菜谱搜索_美食天下`,
            keywords: `美食搜索,菜谱搜索,食材搜索,魔方搜索,日志搜索,会员搜索`,
            description: '为您提供最便捷、最快速的美食相关内容查找！'
        }
        const data = {
            keyword: '',
            recipe_list: [],
            total: 0
        }
        await ctx.render('page/search/index', Object.assign({}, data, conf, { page: 1, page_count: this.limitCount }))
    }
    @Get('/search/:keyword/:page')
    public async searchKeyword(@Ctx ctx: Context) {
        let { keyword, page } = ctx.params
        let list = await ctx.state.db['goods'].findAll({
            where: {
                status: 1,
                g_name: {
                    [Sequelize.Op.like]: `%${keyword}%`
                }
            },
            include: [ctx.state.db['users']],
            limit: this.limitCount,
            offset: (page - 1) * this.limitCount
        })
        const conf = {
            title: `${keyword}_综合搜索_美食天下`,
            keywords: `${keyword},${keyword}做法`,
            description: `美食天下搜索页${keyword}综合搜索`
        }
        let recipe_list = list.map((recipe: Model) => {
            return {
                recipe_id: recipe.get('id'),
                recipe_name: recipe.get('g_name'),
                recipe_cover: recipe.get('img'),
                ingredients: recipe.get('zhuliao') + '、' + (recipe.get('fuliao') ? recipe.get('fuliao') : '无'),
                user_id: recipe.get('user_id'),
                user_name: (<any>recipe).user.get('username')
            }
        })
        const data = {
            keyword,
            recipe_list,
            page,
            page_count: this.limitCount,
            total: recipe_list.length
        }
        if (page == 1) {
            this._total = await ctx.state.db['goods'].count({
                where: {
                    status: 1,
                    g_name: {
                        [Sequelize.Op.like]: `%${keyword}%`
                    }
                },
            })
        }
        data.total = this._total
        await ctx.render('page/search/index', Object.assign({}, data, conf))
    }
}