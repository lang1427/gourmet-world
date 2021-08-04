# gourmet-world
 koa typescript  实现美食天下项目

## 项目运行步骤
1. 安装依赖项
```
npm install 
```
2. 数据库创建   (请确保你已安装并启动了数据库软件)
- 修改 dist/config/config.json 配置文件，同config/config.json   （数据库链接相关）
- 创建数据库 执行 以下命令
> ./node_modules/.bin/sequelize db:create
- 执行迁移文件（创建数据库表，字段）
> ./node_modules/.bin/sequelize db:migrate
- 执行种子文件（添加伪造数据）
> ./node_modules/.bin/sequelize db:seed:all 
3. 编译TS文件 
```
npm run compile
```
4. 运行项目
```
npm run app
```

## 表结构

### 用户表
> **Table: users**

|名称|类型|允许空|默认值|主键|说明|
|:--:|:--:|:--:|:--:|:--:|:--:|
| id | INTEGER | No | - | Yes | 用户id |
| username | VARCHAR(20) | No | - | No | 用户名 |
| password | CHAR(32) | No | - | No | 密码 |

### 用户扩展信息表
> **Table: users_info**

|名称|类型|允许空|默认值|主键|说明|
|:--:|:--:|:--:|:--:|:--:|:--:|
| id | INTEGER | No | - | Yes | 用户id |
| avatar | VARCHAR | No | '/public/images/avatar.png' | No | 用户头像
| sex | ENUM(['男','女','保密']) | No | '男' | No | 性别
| birthprovince | CHAR(10) | Yes | - | No | 所在省份
| birthcity | CHAR(10) | Yes | - | No | 所在城市

> **Foregin Key**

|名称|外键表|外键表字段|
|:--:|:--:|:--:|
| id | users | id |

### 分类表
> **Table: category**

|名称|类型|允许空|默认值|主键|说明|
|:--:|:--:|:--:|:--:|:--:|:--:|
| id | INTEGER | No | - | Yes | 分类id |
| c_name | VARCHAR(50) | No | - | No | 分类名称 |
| p_id | INTEGER | No | - | No | 上级分类id |

### 菜谱表
> **Table: goods**

|名称|类型|允许空|默认值|主键|说明|
|:--:|:--:|:--:|:--:|:--:|:--:|
| id | INTEGER | No | - | Yes | 菜谱id |
| g_name | VARCHAR(30) | No | - | No | 菜谱名称 |
| img | VARCHAR | No | "" | No | 菜谱图片 |
| user_id | INTEGER | No | - | No | 用户id |
| desc | VARCHAR(500) | Yes | "" | No | 菜谱描述 |
| difficulty | ENUM(['简单', '初级', '中级', '高级']) | No | "简单" | No | 制作难度 |
| zhuliao | VARCHAR | No | "" | No | 主料 |
| fuliao | VARCHAR | No | "" | No | 辅料 |
| tiaoliao | VARCHAR | No | "" | No | 调料 |
| category_id | INTEGER | No | -1 | No | 分类id |
| status | TINYINT | No | 3 | No | 审核状态 0：未审核  1：审核通过  2：审核不通过  3：存为草稿|
| status_mes | VARCHAR(100) | YES | - | No | 审核不通过描述信息
| like_count | INTEGER | No | 0 | No | 点赞数量 |
| comment_count | INTEGER | No | 0 | No | 评论数量 |

> **Foregin Key**

|名称|外键表|外键表字段|
|:--:|:--:|:--:|
| user_id | users | id |

### 步骤表
> **Table: step**

|名称|类型|允许空|默认值|主键|说明|
|:--:|:--:|:--:|:--:|:--:|:--:|
| id | INTEGER | No | - | Yes | 步骤id |
| desc | VARCHAR(2000) | No | - | No | 步骤描述 |
| url | VARCHAR(5000) | No | - | No | 步骤图片存放路径 |

### 点赞表
> **Table: like**

|名称|类型|允许空|默认值|主键|说明|
|:--:|:--:|:--:|:--:|:--:|:--:|
| id | INTEGER | No | - | Yes | 主键 |
| user_id | INTEGER | No | - | No | 用户id |
| g_id | INTEGER | No | - | No | 菜谱id |

> **Foregin Key**

|名称|外键表|外键表字段|
|:--:|:--:|:--:|
| user_id | users | id |
| g_id | goods | id |

### 评论表
> **Table: comments**

|名称|类型|允许空|默认值|主键|说明|
|:--:|:--:|:--:|:--:|:--:|:--:|
| id | INTEGER | No | - | Yes | 主键 |
| user_id | INTEGER | No | - | No | 用户id |
| g_id | INTEGER | No | - | No | 菜谱id |
| comment | VARCHAR(500) | No | - | No | 评论内容 |

> **Foregin Key**

|名称|外键表|外键表字段|
|:--:|:--:|:--:|
| user_id | users | id |
| g_id | goods | id |
