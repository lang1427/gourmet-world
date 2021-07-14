import { Context } from "koa";
import { Controller, Ctx, Get, Post, RequestParam } from "koa-controllers";
import { Session } from "koa-session";
import { Model } from "sequelize/types";
import { formatDate } from '../utils/formatDate'

@Controller
export class Comment {
    @Get('/comment')
    public async getComment(@Ctx ctx: Context, @RequestParam('good_id') good_id: number) {
        let res = await ctx.state.db['comments'].findAndCountAll({
            where: {
                g_id: good_id
            },
            order: [
                ['createdAt', 'desc']
            ],
            include: [ctx.state.db['users']]
        })
        if (res.count === 0) {
            ctx.body = {
                code: 1,
                count: 0
            }
        } else {
            let data = res.rows.map((comment: Model) => {
                return {
                    user_id: comment.get('user_id'),
                    user_name: (<any>comment).user.get('username'),
                    content_id: comment.get('id'),
                    content: comment.get('comment'),
                    content_time: formatDate((<Date>comment.get('createdAt')), 'yyyy-MM-dd hh:mm')
                }
            })
            ctx.body = {
                code: 1,
                count: res.count,
                data
            }
        }
    }

    @Post('/add_comment')
    public async addComment(@Ctx ctx: Context) {
        let { good_id, content } = ctx.request.body
        if (!!good_id || !!content) {
            let user_id = (<Session>ctx.session).userID
            if (!!user_id) {

                let Recipe: Model = await ctx.state.db['goods'].findByPk(good_id)
                let User: Model = await ctx.state.db['users'].findByPk(user_id)

                if (!!Recipe || !!User) {
                    let newComment: Model = ctx.state.db['comments'].build({
                        user_id,
                        g_id: good_id,
                        comment: content
                    })
                    await newComment.save()
                    await Recipe.update({
                        comment_count: (<number>Recipe.get('comment_count')) + 1
                    })
                    ctx.body = {
                        code: 1,
                        mes: '发表评论成功！'
                    }
                } else {
                    ctx.body = {
                        code: 2,
                        mes: '该用户或菜谱不存在'
                    }
                }

            } else {
                ctx.body = {
                    code: -1,
                    mes: '未登陆'
                }
            }
        } else {
            ctx.body = {
                code: 0,
                mes: '参数错误'
            }
        }
    }
}