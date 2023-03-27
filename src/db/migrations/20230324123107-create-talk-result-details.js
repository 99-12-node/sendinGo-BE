'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TalkResultDetails', {
      talkResultDetailId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      talkSendId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'TalkSends',
          key: 'talkSendId',
        },
        onDelete: 'CASCADE',
      },
      // userId: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: 'Users',
      //     key: 'userId',
      //   },
      // },
      // companyId: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: 'Companies',
      //     key: 'companyId',
      //   },
      // },
      clientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Clients',
          key: 'clientId',
        },
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Groups',
          key: 'groupId',
        },
      },
      msgid: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      msgContent: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sendDate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sendState: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resultDate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resultState: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lastReportDate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resultMessage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TalkResultDetails');
  },
};
