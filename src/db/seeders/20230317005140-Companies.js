'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Companies', [
      {
        companyName: '회사1',
        companyNumber: '02)1234-1234',
        companyEmail: 'company1@company1.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        companyName: '회사2',
        companyNumber: '031)2222-2222',
        companyEmail: 'company2@company2.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Companies', null, {});
  },
};
