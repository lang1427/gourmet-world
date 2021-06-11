'use strict';
// const {
//     Model
// } = require('sequelize');
import { Sequelize, Model } from "sequelize";
import { IDataTypes } from "../@type-app/data-types";
import { IModelsName } from "../@type-app/models-name";

module.exports = (sequelize: Sequelize, DataTypes: IDataTypes) => {
    class comments extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: IModelsName) {
            // define association here
        }
    };
    comments.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: (<any>Model).users,
                key: 'id'
            }
        },
        g_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: (<any>Model).goods,
                key: 'id'
            }
        },
        comment: {
            type: DataTypes.STRING(500),
            allowNull: false,
            defaultValue: ''
        }
    }, {
        sequelize,
        modelName: 'comments',
        freezeTableName: true
    });
    return comments;
};