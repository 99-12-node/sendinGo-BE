'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'DailyStatistics',
      {
        dailyStatisticsId: {
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
        accumulateClickRatio: {
          type: Sequelize.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        userId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'userId',
          },
          onDelete: 'CASCADE',
        },
        companyId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: 'Companies',
            key: 'companyId',
          },
          onDelete: 'CASCADE',
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
    await queryInterface.dropTable('DailyStatistics');
  },
};
