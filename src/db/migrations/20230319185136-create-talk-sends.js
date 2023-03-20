'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TalkSends', {
      talkSendId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      code: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      message: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mid: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      scnt: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      fcnt: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      msgCount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      msgContent: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sendState: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sendDate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      // userId: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: 'Users',
      //     key: 'userId',
      //   },
      //   onDelete: 'CASCADE',
      // },
      // companyId: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: 'Companies',
      //     key: 'companyId',
      //   },
      //   onDelete: 'CASCADE',
      // },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Groups',
          key: 'groupId',
        },
        onDelete: 'CASCADE',
      },
      talkContentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'TalkContents',
          key: 'talkContentId',
        },
        onDelete: 'RESTRICT',
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
    await queryInterface.dropTable('TalkSends');
  },
};
