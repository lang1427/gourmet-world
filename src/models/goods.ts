'use strict';
const {
    Model
} = require('sequelize');
import { Sequelize } from "sequelize";
import { IDataTypes } from "../@type-app/data-types";
import { IModelsName } from "../@type-app/models-name";

module.exports = (sequelize: Sequelize, DataTypes: IDataTypes) => {
    class goods extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: IModelsName) {
            // define association here
            goods.belongsTo(models.users, {
                foreignKey: 'user_id'
            })
            goods.belongsTo(models.category, {
                foreignKey: 'category_id'
            })
        }
    };
    goods.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        g_name: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        img: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue:''
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: (<any>Model).users,
                key: 'id'
            }
        },
        desc: {
            type: DataTypes.STRING(500),
            allowNull: true,
            defaultValue:''
        },
        difficulty: {
            type: DataTypes.ENUM(['简单', '初级', '中级', '高级']),
            allowNull: false,
            defaultValue:'简单'
        },
        zhuliao: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue:''
        },
        fuliao: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue:''
        },
        tiaoliao: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue:''
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Model.category,
                key: 'id'
            },
            defaultValue:-1
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 3
        },
        like_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        comment_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'goods',
    });
    return goods;
};