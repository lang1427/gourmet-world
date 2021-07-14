import { Context } from "koa";
import { Controller, Ctx, Post } from "koa-controllers";
import { Model } from "sequelize/types";
import create_dirName from '../utils/create_dirName'
const fs = require('fs')
const path = require('path')

const getUrlParam = (name: string, href?: string) => {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    const search = href ? href.split('?')[1] : window.location.href.split('?')[1];
    const r = search.match(reg) || [];
    return r[2];
}

interface Iupload_res {
    size?: number
    path?: string
    name?: string
    type?: string
    mtime?: string
    hash?: string
}

@Controller
export class Upload {
    // 菜谱步骤图
    @Post('/upload/recipe_step')
    public async upload(@Ctx ctx: Context) {
        console.log('/upload:', ctx.request.files)
        let gourmet: Iupload_res = (<any>ctx.request.files).gourmet
        let upload_url = ''
        if (fs.existsSync(gourmet.path)) {
            let new_name = `${gourmet.size}-${gourmet.hash}-${gourmet.name}`
            // 将上传过来的文件 重命名为 文件大小-文件md5-文件名
            fs.renameSync(gourmet.path, gourmet.path?.replace(path.basename(gourmet.path), new_name))
            upload_url = `/public/upload/${create_dirName()}/${new_name}`
        }
        let { step } = ctx.request.body
        let goods_id = getUrlParam('goods_id', ctx.request.header['referer'])
        let stepModel: Model = await ctx.state.db['step'].findByPk(goods_id)
        console.log(stepModel)
        let step_url = JSON.parse(stepModel.get('url') as string)
        step_url[step] = upload_url
        stepModel.update({
            url: JSON.stringify(step_url)
        })
        ctx.body = {
            code: 1,
            url: upload_url
        }
    }
}