import { Context } from "koa";
import { Controller, Ctx, Post } from "koa-controllers";
import { Model } from "sequelize/types";
import { Session } from 'koa-session'
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
        let user_id = (<Session>ctx.session).userID
        if (!!user_id) {
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
            let step_url = JSON.parse(stepModel.get('url') as string)
            let step_desc = undefined
            if (!step || step == "undefined") {
                // 批量上传
                let stepArr = Object.keys(step_url)
                let stepLast = stepArr[stepArr.length - 1]
                step = parseInt(stepLast) + 1
                step_desc = JSON.parse(stepModel.get('desc') as string)
                step_desc[step] = ""
            }
            step_url[step] = upload_url
            stepModel.update({
                desc: JSON.stringify(step_desc),
                url: JSON.stringify(step_url)
            })
            ctx.body = {
                code: 1,
                url: upload_url
            }
        } else {
            ctx.body = {
                code: -1,
                mes: "登录超时，请重新登录"
            }
        }

    }

    // 菜谱成品图
    @Post('/upload/recipe_img')
    public async upload_recipe(@Ctx ctx: Context) {
        let user_id = (<Session>ctx.session).userID
        if (!!user_id) {
            let cover: Iupload_res = (<any>ctx.request.files).cover
            let upload_url = ''
            if (fs.existsSync(cover.path)) {
                let new_name = `${cover.size}-${cover.hash}-${cover.name}`
                // 将上传过来的文件 重命名为 文件大小-文件md5-文件名
                fs.renameSync(cover.path, cover.path?.replace(path.basename(cover.path), new_name))
                upload_url = `/public/upload/${create_dirName()}/${new_name}`
            }
            let goods_id = getUrlParam('goods_id', ctx.request.header['referer'])
            let recipeModel: Model = await ctx.state.db['goods'].findByPk(goods_id)
            await recipeModel.update({
                img: upload_url
            })
            ctx.body = {
                code: 1,
                img: upload_url
            }
        } else {
            ctx.body = {
                code: -1,
                mes: "登录超时，请重新登录"
            }
        }

    }
}