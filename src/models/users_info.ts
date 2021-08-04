'use strict';
import { Sequelize, Model } from "sequelize";
import { IDataTypes } from "../@type-app/data-types";
import { IModelsName } from "../@type-app/models-name";

module.exports = (sequelize: Sequelize, DataTypes: IDataTypes) => {
    class users_info extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: IModelsName) {
            // define association here
        }
    };
    users_info.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            references: {
                model: (<any>Model).users,
                key: 'id'
            }
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '/public/images/avatar.png'
        },
        sex: {
            type: DataTypes.ENUM(['男', '女', '保密']),
            allowNull: false,
            defaultValue: '男'
        },
        birthprovince: {
            type: DataTypes.CHAR(10),
            allowNull: true
        },
        birthcity: {
            type: DataTypes.CHAR(10),
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'users_info',
        freezeTableName: true
    });
    return users_info;
};