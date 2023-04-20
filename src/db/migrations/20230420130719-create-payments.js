'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Payments',
      {
        paymentId: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        paidName: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        isSucces: {
          allowNull: false,
          type: Sequelize.BOOLEAN,
        },
        status: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        paidAmount: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        payMethod: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        paidAt: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        merchantUid: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        impUid: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        pgTid: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        pgProvider: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        userId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'userId',
          },
          onDelete: 'CASCADE',
        },
        companyId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: 'Companies',
            key: 'companyId',
          },
          onDelete: 'CASCADE',
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW'),
        },
      },
      { timestamps: false }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Payments');
  },
};
