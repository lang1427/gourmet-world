import { Context } from 'koa';
import { Controller, Ctx, Post } from 'koa-controllers'
import { Session } from 'koa-session';
import { Model } from 'sequelize/types';

@Controller
export class Like {
    @Post('/add_recipe_like')
    public async addRecipeLike(@Ctx ctx: Context) {
        if (!!(<Session>ctx.session).userID) {
            const { good_id } = (<koaBody>ctx.request).body
            if (!!good_id) {
                let is_like = await ctx.state.db['like'].count({
                    where: {
                        user_id: (<Session>ctx.session).userID,
                        g_id: good_id
                    }
                })
                if (is_like === 1) {
                    ctx.body = {
                        code: 2,
                        mes: '已点赞'
                    }
                } else {
                    // 点赞成功 两个步骤：1.like表新增点赞数据；2.修改goods表中菜谱点赞数量+1
                    let newLikes: Model = ctx.state.db['like'].build({
                        user_id: (<Session>ctx.session).userID,
                        g_id: good_id
                    })
                    await newLikes.save()
                    let good: Model = await ctx.state.db['goods'].findByPk(good_id)
                    await good.update({
                        like_count: (<number>good.get('like_count')) + 1
                    })
                    ctx.body = {
                        code: 1,
                        mes: '点赞成功'
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
}