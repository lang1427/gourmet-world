import { Context } from "koa";
import { Controller, Ctx, Get } from "koa-controllers";
import { Model } from "sequelize/types";

@Controller
export class Step {
    @Get('/step')
    public async step(@Ctx ctx: Context) {
        let id = ctx.query['g_id']
        let res: Model = await ctx.state.db['goods'].findOne({
            where: {
                id,
                status: 1
            },
            include: [ctx.state.db['step'], ctx.state.db['users'], ctx.state.db['category']]
        })
        let category = {
            c_name: (<any>res)['category'].get('c_name'),
            c_id: res.get('category_id'),
            p_id: (<any>res)['category'].get('p_id'),
            p_name: ''
        };
        let p_name = await ctx.state.db['category'].findByPk(category.p_id)
        p_name = p_name.get('c_name')
        category.p_name = p_name
        let data = {
            goods_id: res.get('id'),
            goods_name: res.get('g_name'),
            goods_desc: res.get('desc'),
            goods_img: res.get('img'),
            difficulty: res.get('difficulty'),
            zhuliao: res.get('zhuliao'),
            fuliao: res.get('fuliao'),
            tiaoliao: res.get('tiaoliao'),
            category,
            like_count: res.get('like_count'),
            comment_count: res.get('comment_count'),
            step_desc: (<any>res)['step'].get('desc'),
            step_img: (<any>res)['step'].get('url'),
            user_id: res.get('user_id'),
            user_name: (<any>res)['user'].get('username')
        }
        let description: string = ''
        for (let i in JSON.parse(data.step_desc)) {
            description += i + '.' + JSON.parse(data.step_desc)[i]
        }
        const conf = {
            title: `${data.goods_name}的做法_${data.goods_name}怎么做_${data.user_name}的菜谱_美食天下`,
            keywords: `${data.goods_name},${data.goods_name}的做法,${data.goods_name}的家常做法,${data.goods_name}怎么做,${data.goods_name}的做法步骤,${data.goods_name}的最正宗做法,${data.goods_name}怎么做好吃`,
            description: description
        }
        await ctx.render('page/step/index', Object.assign({}, conf, data))
    }
}