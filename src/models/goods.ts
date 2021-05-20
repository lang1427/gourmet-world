'use strict';
const {
    Model
} = require('sequelize');
import { Sequelize } from "sequelize";
import { IDataTypes } from "../@type-app/data-types";
import { IModelsName } from "../@type-app/models-name";

module.exports = (sequelize:Sequelize, DataTypes:IDataTypes) => {
    class goods extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models:IModelsName) {
            // define association here
            goods.belongsTo(models.users, {
                foreignKey: 'user_id'
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
            allowNull: true
        },
        difficulty: {
            type: DataTypes.ENUM(['简单', '初级', '中级', '高级']),
            allowNull: false
        },
        zhuliao: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fuliao: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tiaoliao: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'goods',
    });
    return goods;
};