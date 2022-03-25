'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class keda extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  keda.init({
    goodsName: DataTypes.STRING,
    goodsAddress: DataTypes.STRING,
    goodsPrice: DataTypes.FLOAT,
    wxAccount: DataTypes.STRING,
    qqAccount: DataTypes.STRING,
    mobile: DataTypes.STRING,
    selfAddress: DataTypes.STRING,
    price: DataTypes.FLOAT,
    photos: DataTypes.STRING,
    desc: DataTypes.STRING,
    openid: DataTypes.STRING,
    runnerOpenid: DataTypes.STRING,
    status: DataTypes.INTEGER,
    avatarUrl: DataTypes.STRING,
    gender: DataTypes.STRING,
    nickName: DataTypes.STRING,
    runnerAvatarUrl: DataTypes.STRING,
    runnerGender: DataTypes.STRING,
    runnerNickName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'keda',
  });
  return keda;
};