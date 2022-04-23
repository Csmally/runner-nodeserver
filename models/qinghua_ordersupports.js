'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class qinghua_ordersupports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  qinghua_ordersupports.init({
    orderid: DataTypes.STRING,
    openid: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'qinghua_ordersupports',
  });
  return qinghua_ordersupports;
};