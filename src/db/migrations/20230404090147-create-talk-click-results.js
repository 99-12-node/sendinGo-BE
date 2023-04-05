'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'TalkClickResults',
      {
        talkClickResultId: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        talkResultDetailId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: 'TalkResultDetails',
            key: 'talkResultDetailId',
          },
        },
        talkSendId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: 'TalkSends',
            key: 'talkSendId',
          },
        },
        originLink: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        trackingUrl: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        clickDevice: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        clickBrowser: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'userId',
          },
        },
        companyId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'companyId',
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
        clientId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Clients',
            key: 'clientId',
          },
        },
        talkContentId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'TalkContents',
            key: 'talkContentId',
          },
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('now'),
        },
      },
      {
        timestamps: false,
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TalkClickResults');
  },
};
