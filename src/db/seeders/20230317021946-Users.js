'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        companyId: 1,
        email: 'user1@company1.com',
        password:
          '$2a$10$2IRazcLP3iqx8vJMPP6o2.UqE9DKj6mIT/7zk/YsDxqijLOvy9paq',
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
          '$2a$10$JrYbpE0t7ZQQE9iT3c/nHO6uSJmVRFSydyke5O1iVVEZYKISrVOqm',
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
