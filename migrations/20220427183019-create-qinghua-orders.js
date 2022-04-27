'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('qinghua_orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderid: {
        type: Sequelize.STRING
      },
      campus: {
        type: Sequelize.STRING
      },
      goodsName: {
        type: Sequelize.STRING
      },
      goodsAddress: {
        type: Sequelize.STRING
      },
      goodsPrice: {
        type: Sequelize.FLOAT
      },
      wxAccount: {
        type: Sequelize.STRING
      },
      qqAccount: {
        type: Sequelize.STRING
      },
      mobile: {
        type: Sequelize.STRING
      },
      selfAddress: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.FLOAT
      },
      photos: {
        type: Sequelize.STRING
      },
      desc: {
        type: Sequelize.STRING
      },
      publisherOpenid: {
        type: Sequelize.STRING
      },
      runnerOpenid: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('qinghua_orders');
  }
};