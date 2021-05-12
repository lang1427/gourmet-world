/**
创建项目
1. 初始化项目 npm init -y
2. 安装项目依赖 数据库(sequelize-cli sequelize mysql2) Koa(koa 网络交互控制层get/post：koa-controllers koa-views koa-ejs) koa-controllers依赖于reflect-metadata
3. 基于typescript支持 安装typescript 并且 生成配置文件 tsc --init
4. 初始化sequelize      .\node_modules\.bin\sequelize init
5. 新建src文件：项目源代码文件
6. 新建dist文件：项目经过ts编译后的文件
7. src新建controllers目录：控制层，存放路由规则
8. src新建view目录：存放模板文件.ejs

 监听src文件变化   tsc -w
 运行项目          node ./dist/app.js 
 
 注意点：
    src/view模板文件中的改动需要手动同步到dist/view中，因为ts不会对ejs进行编译处理，或则可以直接在dist/view文件中进行修改
 */