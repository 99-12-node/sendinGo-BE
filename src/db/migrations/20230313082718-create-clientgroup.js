'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clientgroup', {
      groupId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // userId: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model: 'user',
      //     key: 'userId',
      //   },
      // },
      clientGroupDescription: {
        type: Sequelize.STRING,
      },
      clientGroupName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('clientgroup');
  },
};
