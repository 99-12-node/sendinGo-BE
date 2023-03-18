'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TalkTemplates', [
      {
        talkTemplateCode: 'TM_2048',
        talkTemplateName: '템플릿명',
        talkTemplateContent: `[#{회사명}] 주문완료안내 \\n\\n
        □ 주문번호 : #{주문번호} \\n\\n
        □ 배송지 : #{구/면} #{동/리} \\n\\n
        □ 배송예정일 : #{월일} \\n\\n
        □ 결제금액 : #{결제금액}원`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        talkTemplateCode: 'TM_2216',
        talkTemplateName: '택배번호 안내',
        talkTemplateContent: `#{고객명} 고객님! #{택배회사명}입니다. \\n\\n
        #{택배배송시간} 택배를 배달할 예정입니다. \\n\\n
        등기번호(운송장번호) : #{송장번호}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        talkTemplateCode: 'TM_2217',
        talkTemplateName: '주문완료 안내',
        talkTemplateContent: `[#{회사명}] 주문완료안내 \\n\\n
        □ 주문번호 : #{주문번호} \\n\\n
        □ 배송지 : #{구/면} #{동/리} \\n\\n
        □ 배송예정일 : #{월일} \\n\\n
        □ 결제금액 : #{결제금액}원`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        talkTemplateCode: 'TM_2220',
        talkTemplateName: '사용법 안내',
        talkTemplateContent: `#{고객명}고객님 우리 회사와 거래하여
        주셔서 감사합니다. \\n\\n
        구매하신 제품의 사용(이용)법을 
        확인해 보세요.`,
        // 웹링크 버튼이름 : 사용법바로가기
        // 링크(모바일웹) : http://#{사용법바로가기}
        // 링크(PC): http://#{사용법바로가기}
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        talkTemplateCode: 'TM_2222',
        talkTemplateName: '배송완료 안내',
        talkTemplateContent: `#{고객명}님께서 주문하신 물품이
        배송완료 되었습니다. \\n\\n
        구매확정 부탁드립니다.`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        talkTemplateCode: 'TM_2223',
        talkTemplateName: '회원가입완료 안내',
        talkTemplateContent: `안녕하세요. #{고객명}님! \\n\\n
        #{회사명} \\n\\n
        
        #{회사명}에 회원가입 해주셔서
        진심으로 감사드립니다~`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TalkTemplates', null, {});
  },
};
