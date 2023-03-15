'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Groups', {
      groupId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      groupName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      groupDescription: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      // userId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: 'Users',
      //     key: 'userId',
      //   },
      //   onDelete: 'CASCADE',
      // },
      // companyId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: 'Users',
      //     key: 'companyId',
      //   },
      //   onDelete: 'CASCADE',
      // },
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
    await queryInterface.dropTable('Groups');
  },
};
