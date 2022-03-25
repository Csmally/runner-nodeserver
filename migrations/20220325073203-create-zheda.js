'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('zhedas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      openid: {
        type: Sequelize.STRING
      },
      runnerOpenid: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
      },
      avatarUrl: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      nickName: {
        type: Sequelize.STRING
      },
      runnerAvatarUrl: {
        type: Sequelize.STRING
      },
      runnerGender: {
        type: Sequelize.STRING
      },
      runnerNickName: {
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
    await queryInterface.dropTable('zhedas');
  }
};