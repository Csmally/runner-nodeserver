'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userInfos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      openid: {
        type: Sequelize.STRING
      },
      localAddress: {
        type: Sequelize.STRING
      },
      registerAddress: {
        type: Sequelize.STRING
      },
      createDate: {
        type: Sequelize.STRING
      },
      updateDate: {
        type: Sequelize.STRING
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('userInfos');
  }
};