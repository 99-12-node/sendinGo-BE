'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'TalkVariables',
      {
        talkVariableId: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        talkVariableEng: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        talkVariableKor: {
          allowNull: false,
          type: Sequelize.STRING,
        },
      },
      { timestamps: false }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TalkVariables');
  },
};
