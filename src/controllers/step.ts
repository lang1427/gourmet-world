import { Context } from "koa";
import { Controller, Ctx, Get } from "koa-controllers";

const conf = {
    title: '美食天下_原创菜谱与美食生活社区，我所有的朋友都是吃货！',
    keywords: "美食,菜谱,烹饪,家常菜谱大全,美食网,美食天下",
    description: '美食天下是最大的中文美食网站与厨艺交流社区，拥有海量的优质原创美食菜谱，聚集超千万美食家。我所有的朋友都是吃货，欢迎您加入！'
}

@Controller
export class Step {
    @Get('/step')
    public async step(@Ctx ctx: Context) {
        let id = ctx.query['g_id']
       
        await ctx.render('page/step/index', Object.assign({}, conf))
    }
}