const { logger } = require('../../middlewares/logger');
const axios = require('axios');
const url = require('url');
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

module.exports = class AlimtalkService {
  constructor() {}
  // 토큰 생성
  generateSendToken = async () => {
    logger.info(`AlimtalkService.generateSendToken`);
    const params = new URLSearchParams(noAuthParams);
    const aligoRes = await instance.post(
      '/akv10/token/create/30/d',
      params.toString()
    );
    return aligoRes.data;
  };

  // 알림톡 전송
  sendAlimTalk = async ({ data }) => {
    logger.info(`AlimtalkService.sendAlimTalk`);
    console.log('data: ', data);
    const sendbulkData = {};
    for (let i = 0; i < data.length; i++) {
      // const receiver = `receiver_${i + 1}`;
      // const recvname = `recvname_${i + 1}`;
      // const subject = `subject_${i + 1}`;

      sendbulkData[`receiver_${i + 1}`] = process.env.RECEIVER_1;
      sendbulkData[`recvname_${i + 1}`] = data[i]['recvname'];
      sendbulkData[`subject_${i + 1}`] = data[i]['subject'];
      sendbulkData[`message_${i + 1}`] = data[i]['message']
        .replaceAll('#{회사명}', COMPANY)
        .replaceAll('#{주문번호}', d['주문번호'])
        .replaceAll('#{구/면}', d['구/면'])
        .replaceAll('#{동/리}', d['동/리'])
        .replaceAll('#{월일}', d['월일'])
        .replaceAll('#{결제금액}', d['결제금액'].toLocaleString());
    }
    console.log('sendbulkData: ', sendbulkData);

    const params = new url.URLSearchParams({
      ...authParams,
      senderkey: process.env.ALIGO_SENDERKEY,
      tpl_code: 'TM_2048',
      sender: process.env.SENDER,
      ...sendbulkData,
    });
    console.log('params: ', params);
    const aligoRes = await instance.post(
      '/akv10/alimtalk/send/',
      params.toString()
    );
    console.log('aligoRes.data', aligoRes.data);
    const { mid, scnt, fcnt } = aligoRes.data.info;
    console.log('mid: ', mid, 'scnt: ', scnt, 'fcnt: ', fcnt);

    // 발송결과 DB에 저장
    // await sendResult.create({ mid, scnt, fcnt });
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
