'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
      },
      clientId: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
      },
      groupId: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user');
  },
};
