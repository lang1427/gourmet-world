import { Context } from "koa";
import { Controller, Ctx, Get, Post } from "koa-controllers";
import { Model } from "sequelize/types";
import { Session } from 'koa-session'

@Controller
export class Step {
    public _step: Model | undefined = undefined
    @Get('/step')
    public async step(@Ctx ctx: Context) {
        let g_id = ctx.query['g_id']
        let res: Model = await ctx.state.db['goods'].findOne({
            where: {
                id: g_id,
                status: 1
            },
            include: [{ model: ctx.state.db['users'], include: { model: ctx.state.db['users_info'], attributes: ['avatar'] } }, ctx.state.db['category']]
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
            star_count: res.get('star_count'),
            isStar: false,
            comment_count: res.get('comment_count'),
            step_desc: "",
            step_img: '',
            user_id: res.get('user_id'),
            user_name: (<any>res)['user'].get('username'),
            user_avatar: (<any>res).user.users_info.get('avatar')
        }
        let step: Model = await ctx.state.db['step'].findByPk(g_id)
        data.step_desc = step.get('desc') as string
        data.step_img = step.get('url') as string
        let description: string = ''
        for (let i in JSON.parse(data.step_desc)) {
            description += i + '.' + JSON.parse(data.step_desc)[i]
        }
        const conf = {
            title: `${data.goods_name}?????????_${data.goods_name}?????????_${data.user_name}?????????_????????????`,
            keywords: `${data.goods_name},${data.goods_name}?????????,${data.goods_name}???????????????,${data.goods_name}?????????,${data.goods_name}???????????????,${data.goods_name}??????????????????,${data.goods_name}???????????????`,
            description: description
        }
        // ????????????????????????????????? ????????????????????????????????????  ????????? ?????? isLike?????????true
        if (!!(<Session>ctx.session).userID) {
            let islike = await ctx.state.db['like'].count({
                where: {
                    user_id: (<Session>ctx.session).userID,
                    g_id
                }
            })
            if (islike === 1) data.isLike = true
        }
        // ?????????????????????????????????
        if (!!(<Session>ctx.session).userID) {
            let is_star = await ctx.state.db['star'].count({
                where: {
                    user_id: (<Session>ctx.session).userID,
                    g_id
                }
            })
            if (is_star === 1) data.isStar = true
        }
        await ctx.render('page/step/index', Object.assign({}, conf, data))
    }

    @Post('/get_recipe_step')
    public async get_recipe_step(@Ctx ctx: Context) {
        await this.auth_step(ctx, () => {
            let desc = this._step!.get('desc')
            let url = this._step!.get('url')
            ctx.body = {
                code: 1,
                desc,
                url
            }
        })
    }

    @Post('/edit_recipe_step')
    public async edit_recipe_step(@Ctx ctx: Context) {
        let user_id = (<Session>ctx.session).userID
        if (!!user_id) {
            await this.auth_step(ctx, () => {
                let { desc, url } = (<koaBody>ctx.request).body
                this._step!.update({
                    desc,
                    url
                })
                ctx.body = {
                    code: 1,
                    mes: '????????????'
                }

            })
        } else {
            ctx.body = {
                code: -1,
                mes: '??????????????????????????????'
            }
        }
    }

    private async auth_step(ctx: Context, successCallback: Function) {
        let { recipe_id } = (<koaBody>ctx.request).body
        if (!!recipe_id) {
            this._step = await ctx.state.db['step'].findByPk(recipe_id)
            if (!!this._step) {
                successCallback && successCallback()
            } else {
                ctx.body = {
                    code: 0,
                    mes: '???????????????????????????'
                }
            }
        } else {
            ctx.body = {
                code: 0,
                mes: "????????????"
            }
        }
    }
}
