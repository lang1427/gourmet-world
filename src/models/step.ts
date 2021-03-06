'use strict';
// const {
//     Model
// } = require('sequelize');
import { Sequelize, Model } from "sequelize";
import { IDataTypes } from "../@type-app/data-types";
import { IModelsName } from "../@type-app/models-name";

module.exports = (sequelize: Sequelize, DataTypes: IDataTypes) => {
    class step extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: IModelsName) {
            // define association here
        }
    };
    step.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        desc: {
            type: DataTypes.STRING(2000),
            allowNull: false
        },
        url: {
            type: DataTypes.STRING(5000),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'step',
        freezeTableName: true
    });
    return step;
};