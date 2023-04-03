'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TalkTemplates', [
      {
        talkTemplateCode: 'TM_2048',
        talkTemplateName: '템플릿명',
        talkTemplateContent: `[#{회사명}] 주문완료안내

□ 주문번호 : #{주문번호}

□ 배송지 : #{구/면} #{동/리}

□ 배송예정일 : #{월일}
        
□ 결제금액 : #{결제금액}원`,
        text: null,
        reqData: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        talkTemplateCode: 'TM_2216',
        talkTemplateName: '택배번호 안내',
        talkTemplateContent: `#{고객명} 고객님! #{택배회사명}입니다.

#{택배배송시간} 택배를 배달할 예정입니다.

등기번호(운송장번호) : #{송장번호}`,
        text: `<span id="#{고객명}">#{고객명데이터}</span> 고객님! <span id="#{택배회사명}">#{택배회사명데이터}</span>입니다.
<span id="#{택배배송시간}">#{택배배송시간데이터}</span> 택배를 배달할 예정입니다.
등기번호(운송장번호) : <span id="#{송장번호}">#{송장번호데이터}</span>`,
        reqData: `["#{고객명}", "#{택배회사명}", "#{택배배송시간}", "#{송장번호}"]`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        talkTemplateCode: 'TM_2217',
        talkTemplateName: '주문완료 안내',
        talkTemplateContent: `[#{회사명}] 주문완료안내

□ 주문번호 : #{주문번호}

□ 배송지 : #{구/면} #{동/리}

□ 배송예정일 : #{월일}

□ 결제금액 : #{결제금액}원`,
        text: `[<span id="#{회사명}">#{회사명}</span>] 주문완료안내
□ 주문번호 : <span id="#{주문번호}">#{주문번호}</span>
□ 배송지 : <span id="#{구/면}">#{구/면}</span> <span id="#{동/리}">#{동/리}</span>
□ 배송예정일 : <span id="#{월일}">#{월일}</span>
□ 결제금액 : <span id="#{결제금액}">#{결제금액}</span>원`,
        reqData: `["#{회사명}","#{주문번호}","#{구/면}","#{동/리}","#{월일}","#{결제금액}"]`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        talkTemplateCode: 'TM_2220',
        talkTemplateName: '사용법 안내',
        talkTemplateContent: `#{고객명}고객님 우리 회사와 거래하여 주셔서 감사합니다.

구매하신 제품의 사용(이용)법을 확인해 보세요.`,
        // 웹링크 버튼이름 : 사용법바로가기
        // 링크(모바일웹) : http://#{사용법바로가기}
        // 링크(PC): http://#{사용법바로가기},
        text: `<span id="#{고객명}">#{고객명}</span>고객님 우리 회사와 거래하여 주셔서 감사합니다.
        구매하신 제품의 사용(이용)법을
        확인해 보세요.`,
        reqData: `["#{고객명}"]`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        talkTemplateCode: 'TM_2222',
        talkTemplateName: '배송완료 안내',
        talkTemplateContent: `#{고객명}님께서 주문하신 물품이 배송완료 되었습니다. 

구매확정 부탁드립니다.`,
        text: `<span id="#{고객명}">#{고객명}</span>님께서 주문하신 물품이 배송완료 되었습니다.
    구매확정 부탁드립니다.`,
        reqData: `["#{고객명}"]`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        talkTemplateCode: 'TM_2223',
        talkTemplateName: '회원가입완료 안내',
        talkTemplateContent: `안녕하세요. #{고객명}님!

#{회사명} 
        
#{회사명}에 회원가입 해주셔서 진심으로 감사드립니다~`,
        text: `안녕하세요. <span id="#{고객명}">#{고객명}</span>님!
    <span id="#{회사명}">#{회사명}</span>에 회원가입 해주셔서 진심으로 감사드립니다~`,
        reqData: `["#{고객명}", "#{회사명}"]`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TalkTemplates', null, {});
  },
};
