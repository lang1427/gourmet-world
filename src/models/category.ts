'use strict';
// const {
//     Model
// } = require('sequelize');
import { Sequelize, Model } from "sequelize";
import { IDataTypes } from "../@type-app/data-types";
import { IModelsName } from "../@type-app/models-name";

module.exports = (sequelize:Sequelize, DataTypes:IDataTypes) => {
    class category extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models:IModelsName) {
            // define association here

        } 
    };
    category.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        c_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        p_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'category',
        freezeTableName:true
    });
    return category;
};