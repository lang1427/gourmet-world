'use strict';

import { Sequelize, Model } from "sequelize";
import { IDataTypes } from "../@type-app/data-types";
import { IModelsName } from "../@type-app/models-name";

module.exports = (sequelize: Sequelize, DataTypes: IDataTypes) => {
    class star extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: IModelsName) {
            // define association here
            star.belongsTo(models.goods, {
                foreignKey: 'g_id'
            })
        }
    };
    star.init({
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
    }, {
        sequelize,
        modelName: 'star',
        freezeTableName: true
    });
    return star;
};