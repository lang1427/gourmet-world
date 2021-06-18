import { Context } from "koa";
import { Controller, Ctx, Get } from "koa-controllers";
import { Model } from "sequelize/types";
import { Session } from 'koa-session'

@Controller
export class Step {
    @Get('/step')
    public async step(@Ctx ctx: Context) {
        let g_id = ctx.query['g_id']
        let res: Model = await ctx.state.db['goods'].findOne({
            where: {
                id: g_id,
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
            isLike: false,
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
        // 判断当前用户是否已点赞 （首先判断用户是否登陆）  若点赞 则把 isLike设置为true
        if (!!(<Session>ctx.session).userID) {
            let islike = await ctx.state.db['like'].count({
                where: {
                    user_id: (<Session>ctx.session).userID,
                    g_id
                }
            })
            if (islike === 1) data.isLike = true
        }
        await ctx.render('page/step/index', Object.assign({}, conf, data))
    }
}