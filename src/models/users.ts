'use strict';
// const {
//   Model
// } = require('sequelize');
import { Sequelize, Model } from "sequelize";
import { IDataTypes } from "../@type-app/data-types";
import { IModelsName } from "../@type-app/models-name";

module.exports = (sequelize:Sequelize, DataTypes:IDataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models:IModelsName) {
      // define association here
      users.hasMany(models.goods,{
        foreignKey:'user_id'
      })
    }
  }; 
  users.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    password: {
      type: DataTypes.CHAR(32),
      allowNull: false,
      defaultValue: ''
    }
  }, {
    sequelize,
    modelName: 'users',
    defaultScope: {
      attributes: {
        exclude: ['password']   // 排除 password字段，操作数据库时不返回
      }
    }
  });
  return users;
};