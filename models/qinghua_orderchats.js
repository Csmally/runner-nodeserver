'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class qinghua_orderchats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  qinghua_orderchats.init({
    orderid: DataTypes.STRING,
    fromOpenid: DataTypes.STRING,
    fromName: DataTypes.STRING,
    toOpenid: DataTypes.STRING,
    toName: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'qinghua_orderchats',
  });
  return qinghua_orderchats;
};