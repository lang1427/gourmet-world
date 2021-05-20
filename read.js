/**
创建项目
1. 初始化项目 npm init -y
2. 安装项目依赖 数据库(sequelize-cli sequelize mysql2) Koa(koa 网络交互控制层get/post：koa-controllers koa-views koa-ejs) koa-controllers依赖于reflect-metadata
3. 基于typescript支持 安装typescript 并且 生成配置文件 tsc --init
4. 初始化sequelize      .\node_modules\.bin\sequelize init
5. 新建src文件：项目源代码文件
6. 新建dist文件：项目经过ts编译后的文件
7. src新建controllers目录：控制层，存放路由规则
8. dist新建view目录：存放模板文件.ejs     （不会编译生成的文件）
9. 创建模型文件     ./node_modules/.bin/sequelize model:create --name users --attributes username:STRING
10. 将模型文件models放在src目录下，并将js文件更改为ts文件
11. 备份config目录到dist目录下
12. dist新建static目录，存放静态资源文件  （不会编译生成的文件）


数据库：
   1.创建数据库    ./node_modules/.bin/sequelize db:create 
   2.执行迁移文件   ./node_modules/.bin/sequelize db:migrate
   3.执行种子文件    ./node_modules/.bin/sequelize db:seed:all    


 监听src文件变化   tsc -w
 运行项目          node ./dist/app.js 
 
 注意点：
    src/view模板文件中的改动需要手动同步到dist/view中，因为ts不会对ejs进行编译处理，或则可以直接在dist/view文件中进行修改

 Bug?
   1.Class constructor Model cannot be invoked without 'new'
      设置tsconfig.json target 为 ES2015 即可解决    (保留class关键字)
 */