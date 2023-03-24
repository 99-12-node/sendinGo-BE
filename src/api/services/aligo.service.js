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
        .replaceAll('#{결제금액}', talkVariableValue.paymentPrice)
        .replaceAll('#{택배회사명}', talkVariableValue.deliveryCompany)
        .replaceAll('#{택배배송시간}', talkVariableValue.deliveryTime)
        .replaceAll('#{송장번호}', talkVariableValue.deliveryNumber);
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
  getAlimTalkResult = async ({ page, limit, startdate, enddate }) => {
    logger.info(`AlimtalkService.getAlimTalkResult`);

    const today = new Date();
    const formatToday = today.toISOString().slice(0, 10).replace(/-/g, ''); // yyyymmdd

    const params = new url.URLSearchParams({
      ...authParams,
      page: page ?? 1,
      limit: limit ?? 50,
      startdate: startdate ?? formatToday - 7,
      enddate: enddate ?? formatToday, // 이전일을 기본값,
    });

    const aligoRes = await instance.post(
      '/akv10/history/list/',
      params.toString()
    );

    const result = [];
    // 에러 코드인 경우
    if (aligoRes.data.code < 0) {
      throw new Error(aligoRes.data.message);
    }
    // 결과가 없는 경우
    if (!aligoRes.data.list.length) {
      return aligoRes.data.list;
    }

    // 결과가 1개 이상인 경우, 발송결과 DB에 결과 개수만큼 N번 저장
    for (const data of aligoRes.data.list) {
      const { mid, msg_count, mbody, reserve_state, regdate } = data;
      result.push({
        mid,
        msgCount: msg_count,
        msgContent: mbody,
        sendState: reserve_state,
        sendDate: regdate,
      });
    }
    return result;
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
