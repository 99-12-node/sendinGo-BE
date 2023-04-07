'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Statistics',
      {
        statisticsId: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userAfterJoinDate: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        totalClientCount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        totalGroupCount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        accumulateSendCount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        accumulateSuccessCount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        accumulateSuccessRatio: {
          type: Sequelize.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        accumulateSuccessRatio: {
          type: Sequelize.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        talkSendId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('now'),
        },
      },
      { timestamps: false }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Statistics');
  },
};
