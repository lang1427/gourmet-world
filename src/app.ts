const path = require('path')
import Koa from 'koa'
import { useControllers } from 'koa-controllers'
import views from 'koa-views'  // 模板渲染中间件 
import staticCache from 'koa-static-cache'     // 静态资源文件处理
import koaBody from 'koa-body'
import session from 'koa-session'
import { Context } from 'koa'

const app = new Koa()

const db = require('./models')

app.use(async (ctx: Context, next) => {
    ctx.state.db = db
    await next()
})

app.keys = ['kanglang']

const sessionConf = {
    key: 'gourmet.world',
    maxAge: 86400000
    // maxAge: 900000   // 过期时间15分钟
}

app.use(session(sessionConf, app))

import check_dirExist from './utils/check_dirExist'
import create_dirName from './utils/create_dirName'
app.use(koaBody({
    multipart: true, // 支持多文件上传
    formidable: {
        uploadDir: path.join(__dirname, 'static/upload'), // 文件上传的路径  默认保存在临时文件夹C:/xxx/temp
        keepExtensions: true,    // 保留文件扩展名
        hash: "md5",         // 文件md5值
        onFileBegin: (name, file) => {      // 文件上传前执行的特殊回调函数
            // console.log(name, file)  name: input:file name属性值； file: 文件信息
            const dir = path.join(__dirname, 'static/upload/' + create_dirName())
            check_dirExist(dir)
            // 重新覆盖文件保存的路径
            file.path = `${dir}\\${path.basename(file.path)}`
        }
    }
}))       // post解析，通过ctx.request.body 获取post请求传递过来的参数
app.use(staticCache(path.join(__dirname, 'static'), {
    prefix: '/public',
    gzip: true
}))
const render = views(__dirname + '/view', {  // 加载当前view目录下所有的.ejs文件  需安装koa-ejs，无需注册koa-ejs即可使用
    extension: 'ejs'         // 省略后缀名
})
app.use(render)

// 统一配置404界面
app.use(async (ctx, next) => {
    await next();
    if (ctx.status === 404) {
        await ctx.render('page/not_found/index')
    }
})

// 配置所有的控制层（路由规则）： 即会读取当前文件夹 controllers 下所有的文件作为路由规则
useControllers(app, __dirname + '/controllers/**/*.js', {    // 这里不填*.ts的原因是因为打包之后生成的都是js文件，ts编译不会更改这个字符串为.js
    multipart: {
        dest: './uploads'
    }
})

app.listen(8888, () => {
    console.log(`
        App running at:
            http://localhost:8888/
    `)
})