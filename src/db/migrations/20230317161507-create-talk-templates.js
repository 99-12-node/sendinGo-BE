'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TalkTemplates', {
      talkTemplateId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      talkTemplateCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      talkTemplateName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      talkTemplateContent: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      text: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reqData: {
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
    await queryInterface.dropTable('TalkTemplates');
  },
};
