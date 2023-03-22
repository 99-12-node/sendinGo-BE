'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TalkVariables', [
      {
        talkVariableEng: 'organizationName',
        talkVariableKor: '회사명',
      },
      {
        talkVariableEng: 'orderNumber',
        talkVariableKor: '주문번호',
      },
      {
        talkVariableEng: 'region',
        talkVariableKor: '구/면',
      },
      {
        talkVariableEng: 'regionDetail',
        talkVariableKor: '동/리',
      },
      {
        talkVariableEng: 'deliveryDate',
        talkVariableKor: '월일',
      },
      {
        talkVariableEng: 'paymentPrice',
        talkVariableKor: '결제금액',
      },
      {
        talkVariableEng: 'deliveryCompany',
        talkVariableKor: '택배회사명',
      },
      {
        talkVariableEng: 'deliveryTime',
        talkVariableKor: '택배배송시간',
      },
      {
        talkVariableEng: 'deliveryNumber',
        talkVariableKor: '송장번호',
      },
      {
        talkVariableEng: 'customerName',
        talkVariableKor: '고객명',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TalkVariables', null, {});
  },
};
