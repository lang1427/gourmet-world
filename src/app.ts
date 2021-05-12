import Koa from 'koa'
import { useControllers } from 'koa-controllers'
import views from 'koa-views'  // 模板渲染中间件 
 

const app = new Koa()
const render = views(__dirname + '/view', {  // 加载当前view目录下所有的.ejs文件  需安装koa-ejs，无需注册koa-ejs即可使用
    extension:'ejs'         // 省略后缀名
})  

app.use(render) 

// 配置所有的控制层（路由规则）： 即会读取当前文件夹 controllers 下所有的文件作为路由规则
useControllers(app, __dirname + '/controllers/**/*.js', {    // 这里不填*.ts的原因是因为打包之后生成的都是js文件，ts编译不会更改这个字符串为.js
    multipart: {
        dest: './uploads'
    }
})

app.listen(8888)