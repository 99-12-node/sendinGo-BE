'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Groups', [
      {
        groupName: '회사1 관리자 테스트',
        groupDescription: '테스트1',
        userId: 1,
        companyId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        groupName: '회사2 관리자 테스트',
        groupDescription: '회원2 회사2 테스트',
        userId: 2,
        companyId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Groups', null, {});
  },
};
