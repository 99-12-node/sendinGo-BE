'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Clients', [
      {
        clientName: '일고객',
        contact: '01012121212',
        clientEmail: 'client1@clinet.com',
        // userId: 1,
        // companyId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        clientName: '이고객',
        contact: '01021212121',
        clientEmail: 'client2@clinet.com',
        // userId: 1,
        // companyId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Clients', null, {});
  },
};
