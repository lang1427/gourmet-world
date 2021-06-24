const path = require('path')
import Koa from 'koa'
import { useControllers } from 'koa-controllers'
import views from 'koa-views'  // 模板渲染中间件 
import staticCache from 'koa-static-cache'     // 静态资源文件处理
import BodyParser from 'koa-bodyparser'
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
app.use(BodyParser())       // post解析，通过ctx.request.body 获取post请求传递过来的参数
app.use(staticCache(path.join(__dirname, 'static'), {
    prefix: '/public',
    gzip: true
}))
const render = views(__dirname + '/view', {  // 加载当前view目录下所有的.ejs文件  需安装koa-ejs，无需注册koa-ejs即可使用
    extension: 'ejs'         // 省略后缀名
})
app.use(render)

// 配置所有的控制层（路由规则）： 即会读取当前文件夹 controllers 下所有的文件作为路由规则
useControllers(app, __dirname + '/controllers/**/*.js', {    // 这里不填*.ts的原因是因为打包之后生成的都是js文件，ts编译不会更改这个字符串为.js
    multipart: {
        dest: './uploads'
    }
})

app.listen(8888)