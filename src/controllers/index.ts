import { Controller, Ctx, Get } from "koa-controllers";
import { Context } from 'koa'
import { Model } from "sequelize/types";

interface ICategory {
    id: number
    pid: number
    name: string
}

const conf = {
    title: '美食天下_原创菜谱与美食生活社区，我所有的朋友都是吃货！',
    keywords: "美食,菜谱,烹饪,家常菜谱大全,美食网,美食天下",
    description: '美食天下是最大的中文美食网站与厨艺交流社区，拥有海量的优质原创美食菜谱，聚集超千万美食家。我所有的朋友都是吃货，欢迎您加入！'
}

@Controller
export class Index {

    public category: object[] = []
    public categoryTree: object[] = []
    public goodsInfo: object[] = []

    @Get('/')     // 当通过get请求/时 则进入到下面这个方法中
    public async index(@Ctx ctx: Context) {

        let categoryList = await ctx.state.db['category'].findAll()
        this.category = categoryList.map((category: Model) => {
            return {
                id: category.get('id'),
                pid: category.get('p_id'),
                name: category.get('c_name')
            }
        })
        this.categoryTree = this._tree(0)
        // SELECT goods.id,goods.g_name,goods.img,goods.user_id,users.username FROM goods LEFT JOIN users on goods.user_id=users.id WHERE goods.status = 1 LIMIT 50
        let goods = await ctx.state.db['goods'].findAll({
            where: {
                status: 1
            },
            attributes: ['id', 'g_name', 'img', 'user_id'],
            limit: 50,
            include: ctx.state.db['users']
        })

        this.goodsInfo = goods.map((good: Model) => {
            return {
                good_id: good.get('id'),
                good_img: good.get('img'),
                good_name: good.get('g_name'),
                user_id: good.get('user_id'),
                user_name: (<any>good).user.get('username')
            }
        })
        await ctx.render('index', Object.assign({}, conf, { category: this.categoryTree }, { goodsInfo: this.goodsInfo }))
    }
    public _tree(id: number): object[] {
        let data = this.category.filter(item => {
            return (<ICategory>item).pid === id
        })
        data.forEach(item => {
            (<any>item).children = this._tree((<ICategory>item).id)
        })
        return data
    }
}