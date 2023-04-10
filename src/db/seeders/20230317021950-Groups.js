'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Groups', [
      {
        groupName: '미지정',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1,
        companyId: 1,
      },
      {
        groupName: '미지정',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 2,
        companyId: 2,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Groups', null, {});
  },
};
