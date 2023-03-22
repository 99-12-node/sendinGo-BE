const { logger } = require('../../middlewares/logger');
const axios = require('axios');
const url = require('url');
const { BadRequestError } = require('../../exceptions/errors');
require('dotenv').config();

const instance = axios.create({
  baseURL: process.env.ALIGO_BASE_URL,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});

const noAuthParams = {
  apikey: process.env.ALIGO_APIKEY,
  userid: process.env.ALIGO_USERID,
};

const authParams = {
  apikey: process.env.ALIGO_APIKEY,
  userid: process.env.ALIGO_USERID,
  token: process.env.ALIGO_TOKEN,
};

const COMPANY = 'sendigo';

module.exports = class AligoService {
  constructor() {}
  // 토큰 생성
  generateSendToken = async () => {
    logger.info(`AligoService.generateSendToken`);
    const params = new URLSearchParams(noAuthParams);
    const aligoRes = await instance.post(
      '/akv10/token/create/10/d',
      params.toString()
    );
    return aligoRes.data;
  };

  // 알림톡 전송
  sendAlimTalk = async (data) => {
    logger.info(`AligoService.sendAlimTalk`);

    // 알리고 알림톡 전송 API 양식에 맞게 데이터 정리
    const sendbulkData = {};
    for (let i = 0; i < data.length; i++) {
      const talkVariableValue = data[i].talkSendData.dataValues;
      sendbulkData[`receiver_${i + 1}`] = data[i].receiver;
      sendbulkData[`recvname_${i + 1}`] = data[i].recvname;
      sendbulkData[`subject_${i + 1}`] = data[i].subject;
      sendbulkData[`message_${i + 1}`] = data[i].message
        .replaceAll('#{회사명}', talkVariableValue.organizationName)
        .replaceAll('#{고객명}', talkVariableValue.customerName)
        .replaceAll('#{주문번호}', talkVariableValue.orderNumber)
        .replaceAll('#{구/면}', talkVariableValue.region)
        .replaceAll('#{동/리}', talkVariableValue.regionDetail)
        .replaceAll('#{월일}', talkVariableValue.deliveryDate)
        .replaceAll(
          '#{결제금액}',
          talkVariableValue.paymentPrice
            ? talkVariableValue.paymentPrice.toLocaleString()
            : ''
                .replaceAll('#{택배회사명}', talkVariableValue.deliveryCompany)
                .replaceAll('#{택배배송시간}', talkVariableValue.deliveryTime)
                .replaceAll('#{송장번호}', talkVariableValue.deliveryNumber)
        );
    }

    // 알리고 알림톡 전송 API Parameter 만들기
    const params = new url.URLSearchParams({
      ...authParams,
      senderkey: process.env.ALIGO_SENDERKEY,
      tpl_code: data[0].talkTemplateCode,
      sender: process.env.SENDER,
      ...sendbulkData,
      // testMode: 'Y',
    });

    // 알리고 알림톡 전송 요청
    const aligoRes = await instance.post(
      '/akv10/alimtalk/send/',
      params.toString()
    );

    if (aligoRes.data.code < 0) {
      throw new BadRequestError(`${aligoRes.data.message}`);
    }
    return aligoRes.data;
  };

  // 알림톡 전송 결과
  getAlimTalkResult = async () => {
    logger.info(`AlimtalkService.getAlimTalkResult`);
    // const dateFormat = new Date().toISOString().substring(0, 10).replaceAll('-',''); // yyyymmdd
    // const startdate = filter.startdate;
    // const enddate = filter.enddate;
    const params = new url.URLSearchParams({
      ...authParams,
      //   page: filter.page ?? '1',
      //   limit: filter.limit ?? '10',
    });

    const aligoRes = await instance.post(
      '/akv10/history/list/',
      params.toString()
    );
    console.log('aligoRes.data:', aligoRes.data);
    const { mid, sender, msg_count, mbody, regdate } = aligoRes.data.list[0];
    console.log(
      'mid, sender, msg_count, mbody, regdate : ',
      mid,
      sender,
      msg_count,
      mbody,
      regdate
    );
    // 발송결과 DB에 결과 개수만큼 N번 저장
    // for (let list of aligoRes.data.list) {
    //   const { mid, sender, msg_count, mbody, regdate } = list;
    //   console.log(
    //     'mid, sender, msg_count, mbody, regdate : ',
    //     mid,
    //     sender,
    //     msg_count,
    //     mbody,
    //     regdate
    //   );
    // await alimTalkResult.create({ mid, sender, msg_count, mbody, regdate });
    // }
    return aligoRes.data;
  };

  // 알림톡 전송 결과 상세
  getAlimTalkDetailResult = async ({ mid }) => {
    logger.info(`AlimtalkService.getAlimTalkDetailResult`);
    const params = new url.URLSearchParams({
      ...authParams,
      mid,
    });

    const aligoRes = await instance.post(
      '/akv10/history/detail/',
      params.toString()
    );
    const {
      msgid,
      sender,
      phone,
      status,
      reqdate,
      sentdate,
      rsltdate,
      reportdate,
      rslt,
      rslt_message,
      message,
    } = aligoRes.data.list[0];
    console.log(
      'raligoReses : ',
      msgid,
      sender,
      phone,
      status,
      reqdate,
      sentdate,
      rsltdate,
      reportdate,
      rslt,
      rslt_message,
      message
    );
    // 발송결과 DB에 결과 개수만큼 N번 저장
    // for (let data of aligoRes.data.list) {
    // await alimTalkResult.create({ mid, sender, msg_count, mbody, regdate });
    // }
    return aligoRes.data;
  };
};
