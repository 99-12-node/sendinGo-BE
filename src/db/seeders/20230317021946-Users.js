'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        companyId: 1,
        email: 'user1@company1.com',
        password:
          '$2a$10$Riaz2YAyCj/KZY65CgHsNOuvbaoYdDpefwBdmrek6jas.bw571C/e',
        name: '일하나',
        phoneNumber: '01010101010',
        provider: 0,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        companyId: 2,
        email: 'user2@company2.com',
        password:
          '$2a$10$Jsh5CsGuVF.qqTscQPJDq.RH2.wpWk9UD2mR1Ghls7VsZ3wZvPsKa',
        name: '이두',
        phoneNumber: '01010101010',
        provider: 0,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
