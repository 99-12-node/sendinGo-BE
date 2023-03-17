'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Clientgroups', {
      clientGroupId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      clientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Clients',
          key: 'clientId',
        },
        onDelete: 'CASCADE',
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Groups',
          key: 'groupId',
        },
        onDelete: 'CASCADE',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Clientgroups');
  },
};
