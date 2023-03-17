'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'TalkTemplatesVariables',
      {
        talkTemplatesVariablesId: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        talkTemplateId: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'TalkTemplates',
            key: 'talkTemplateId',
          },
          onDelete: 'CASCADE',
        },
        talkVariableId: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'TalkVariables',
            key: 'talkVariableId',
          },
          onDelete: 'CASCADE',
        },
      },
      { timestamps: false }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TalkTemplatesVariables');
  },
};
