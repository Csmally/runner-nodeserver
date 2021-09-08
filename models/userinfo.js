'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  userInfo.init({
    openid: DataTypes.STRING,
    localAddress: DataTypes.STRING,
    registerAddress: DataTypes.STRING,
    createDate: DataTypes.STRING,
    updateDate: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'userInfo',
    timestamps: false
  });
  return userInfo;
};