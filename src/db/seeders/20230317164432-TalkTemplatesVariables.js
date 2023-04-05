'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'TalkTemplatesVariables',
      [
        {
          talkTemplateId: 1,
          talkVariableId: 1,
        },
        {
          talkTemplateId: 3,
          talkVariableId: 1,
        },
        {
          talkTemplateId: 6,
          talkVariableId: 1,
        },
        {
          talkTemplateId: 1,
          talkVariableId: 2,
        },
        {
          talkTemplateId: 3,
          talkVariableId: 2,
        },
        {
          talkTemplateId: 1,
          talkVariableId: 3,
        },
        {
          talkTemplateId: 3,
          talkVariableId: 3,
        },
        {
          talkTemplateId: 1,
          talkVariableId: 4,
        },
        {
          talkTemplateId: 3,
          talkVariableId: 4,
        },
        {
          talkTemplateId: 1,
          talkVariableId: 5,
        },
        {
          talkTemplateId: 3,
          talkVariableId: 5,
        },
        {
          talkTemplateId: 1,
          talkVariableId: 6,
        },
        {
          talkTemplateId: 3,
          talkVariableId: 6,
        },
        {
          talkTemplateId: 2,
          talkVariableId: 7,
        },
        {
          talkTemplateId: 2,
          talkVariableId: 8,
        },
        {
          talkTemplateId: 2,
          talkVariableId: 9,
        },
        {
          talkTemplateId: 2,
          talkVariableId: 10,
        },
        {
          talkTemplateId: 4,
          talkVariableId: 10,
        },
        {
          talkTemplateId: 5,
          talkVariableId: 10,
        },
        {
          talkTemplateId: 6,
          talkVariableId: 10,
        },
        {
          talkTemplateId: 4,
          talkVariableId: 11,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('TalkTemplatesVariables', null, {});
    } catch (e) {
      console.error(e);
    }
  },
};
