# gourmet-world
 koa typescript  实现美食天下项目

## 表结构

### 用户表
> **Table: users**

|名称|类型|允许空|默认值|主键|说明|
|:--:|:--:|:--:|:--:|:--:|:--:|
| id | INTEGER | No | - | Yes | 用户id |
| username | VARCHAR(20) | No | - | No | 用户名 |
| password | CHAR(32) | No | - | No | 密码 |

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
| user_id | INTEGER | No | - | No | 用户id |
| desc | VARCHAR(500) | Yes | - | No | 菜谱描述 |
| difficulty | ENUM(['简单', '初级', '中级', '高级']) | No | - | No | 制作难度 |
| zhuliao | VARCHAR | No | - | No | 主料 |
| fuliao | VARCHAR | No | - | No | 辅料 |
| tiaoliao | VARCHAR | No | - | No | 调料 |
| category_id | INTEGER | No | - | No | 分类id |
| status | TINYINT | No | 0 | No | 审核状态 0：未审核  1：审核通过  2：审核不通过 |

> **Foregin Key**

|名称|外键表|外键表字段|
|:--:|:--:|:--:|
| user_id | users | id |

### 步骤表
> **Table: step**

|名称|类型|允许空|默认值|主键|说明|
|:--:|:--:|:--:|:--:|:--:|:--:|
| id | INTEGER | No | - | Yes | 步骤id |
| desc | VARCHAR(1000) | No | - | No | 步骤描述 |
| url | VARCHAR(1000) | No | - | No | 步骤图片存放路径 |
| g_id | INTEGER | No | - | Yes | 菜谱id |

> **Foregin Key**

|名称|外键表|外键表字段|
|:--:|:--:|:--:|
| g_id | goods | id |


