const { logger } = require('../../middlewares/logger');
const axios = require('axios');

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
    const aligoRes = await instance.post(
      '/akv10/token/create/3/m',
      noAuthParams
    );
    return aligoRes.data;
  };

  // 알림톡 전송
  sendAlimTalk = async ({
    tpl_code,
    recvname_1,
    subject_1,
    message_1,
    testMode,
  }) => {
    logger.info(`AlimtalkService.sendAlimTalk`);
    const params = {
      ...authParams,
      senderkey: process.env.ALIGO_SENDERKEY,
      tpl_code: 'TM_2048',
      sender: process.env.SENDER,
      receiver_1: process.env.RECEIVER_1,
      recvname_1,
      subject_1,
      message_1,
      /*
        `[${COMPANY}] 주문완료안내\n
        □ 주문번호 : 123412314123\n
        □ 배송지 : 어느구 어느동\n
        □ 배송예정일 : 03월 10일 \n
        □ 결제금액 : 10,000 원`
      */
      testMode: 'Y',
    };

    const aligoRes = await instance.post('/akv10/alimtalk/send/', params);
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
    const params = {
      ...authParams,
      //   page: filter.page ?? '1',
      //   limit: filter.limit ?? '10',
    };

    const aligoRes = await instance.post('/akv10/history/list/', params);
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
    const params = new URLSearchParams({
      ...authParams,
      mid: req.query.mid,
    });

    const aligoRes = await instance.post('/akv10/history/detail/', params);
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
