'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('campusSuggestions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      openid: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      sex: {
        type: Sequelize.STRING
      },
      age: {
        type: Sequelize.INTEGER
      },
      grade: {
        type: Sequelize.STRING
      },
      wxAccount: {
        type: Sequelize.STRING
      },
      qqAccount: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      campusName: {
        type: Sequelize.STRING
      },
      campusNature: {
        type: Sequelize.STRING
      },
      campusAddress: {
        type: Sequelize.STRING
      },
      isJoin: {
        type: Sequelize.STRING
      },
      desc: {
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
    await queryInterface.dropTable('campusSuggestions');
  }
};