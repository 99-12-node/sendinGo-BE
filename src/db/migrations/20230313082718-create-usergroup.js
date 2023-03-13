'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usergroup', {
      groupId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      clientId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'client',
          key: 'clientId',
        },
      },
      userGroupDescription: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userGroupTagName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userGroupName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usergroup');
  },
};
