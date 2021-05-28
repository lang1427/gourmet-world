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

    @Get('/')     // 当通过get请求/时 则进入到下面这个方法中
    public async index(@Ctx ctx: Context) {

        let categoryList = await ctx.state.db.category.findAll()
        this.category = categoryList.map((category: Model) => {
            return {
                id: category.get('id'),
                pid: category.get('p_id'),
                name: category.get('c_name')
            }
        })
        this.categoryTree = this._tree(0)
        await ctx.render('index', Object.assign({}, conf, { category: this.categoryTree }))
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

@Controller
export class User {
    @Get('/user')     // 当通过get请求/时 则进入到下面这个方法中
    public async user(@Ctx ctx: Context) {
        ctx.body = 'user';
    }
}