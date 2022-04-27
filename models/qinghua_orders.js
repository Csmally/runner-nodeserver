'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class qinghua_orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  qinghua_orders.init({
    orderid: DataTypes.STRING,
    campus: DataTypes.STRING,
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
    publisherOpenid: DataTypes.STRING,
    runnerOpenid: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'qinghua_orders',
  });
  return qinghua_orders;
};