const { logger } = require('../../middlewares/logger');
const ClientRepository = require('../repositories/client.repository');
const TalkContentRepository = require('../repositories/talkcontent.repository');
const TalkTemplateRepository = require('../repositories/talktemplate.repository');
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

module.exports = class AlimtalkService {
  constructor() {
    this.clientRepositoy = new ClientRepository();
    this.talkContentRepository = new TalkContentRepository();
    this.talkTemplateRepository = new TalkTemplateRepository();
  }
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

  // 알림톡 전송 내용 저장
  saveTalkContents = async ({ clientId, ...talkContentData }) => {
    logger.info(`AlimtalkService.saveTalkContents`);
    try {
      const result = await this.talkContentRepository.createTalkContent({
        clientId,
        ...talkContentData,
      });
      return { message: '성공적으로 저장 하였습니다.', data: result };
    } catch (e) {
      console.error(e);
      throw new BadRequestError('입력값을 다시 확인해주세요.');
    }
  };

  // 알림톡 전송
  sendAlimTalk = async ({ data }) => {
    logger.info(`AlimtalkService.sendAlimTalk`);
    console.log('data: ', data);
    const sendbulkData = {};
    for (let i = 0; i < data.length; i++) {
      sendbulkData[`receiver_${i + 1}`] = process.env.RECEIVER_1;
      sendbulkData[`recvname_${i + 1}`] = data[i]['recvname'];
      sendbulkData[`subject_${i + 1}`] = data[i]['subject'];
      sendbulkData[`message_${i + 1}`] = data[i]['message']
        .replaceAll('#{회사명}', COMPANY)
        .replaceAll('#{고객명}', data[i]['고객명'])
        .replaceAll('#{고객명}', data[i]['고객명'])
        .replaceAll('#{주문번호}', data[i]['주문번호'])
        .replaceAll('#{구/면}', data[i]['구/면'])
        .replaceAll('#{동/리}', data[i]['동/리'])
        .replaceAll('#{월일}', data[i]['월일'])
        .replaceAll(
          '#{결제금액}',
          data[i]['결제금액']
            .toLocaleString()
            .replaceAll('#{택배회사명}', data[i]['택배회사명'])
            .replaceAll('#{택배배송시간}', data[i]['택배배송시간'])
            .replaceAll('#{송장번호}', data[i]['송장번호'])
        );
    }
    console.log('sendbulkData: ', sendbulkData);

    const params = new url.URLSearchParams({
      ...authParams,
      senderkey: process.env.ALIGO_SENDERKEY,
      tpl_code: 'TM_2048',
      sender: process.env.SENDER,
      ...sendbulkData,
    });

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
