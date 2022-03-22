'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class campusSuggestions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  campusSuggestions.init({
    openid: DataTypes.STRING,
    name: DataTypes.STRING,
    sex: DataTypes.STRING,
    age: DataTypes.INTEGER,
    grade: DataTypes.STRING,
    wxAccount: DataTypes.STRING,
    qqAccount: DataTypes.STRING,
    email: DataTypes.STRING,
    campusName: DataTypes.STRING,
    campusNature: DataTypes.STRING,
    campusAddress: DataTypes.STRING,
    isJoin: DataTypes.STRING,
    desc: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'campusSuggestions',
  });
  return campusSuggestions;
};