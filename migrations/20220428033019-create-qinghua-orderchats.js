'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('qinghua_orderchats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderid: {
        type: Sequelize.STRING
      },
      fromOpenid: {
        type: Sequelize.STRING
      },
      fromName: {
        type: Sequelize.STRING
      },
      toOpenid: {
        type: Sequelize.STRING
      },
      toName: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('qinghua_orderchats');
  }
};