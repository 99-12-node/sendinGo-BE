const { logger } = require('../../middlewares/logger');
const {
  TalkResultDetails,
  Clients,
  TalkResultsClients,
} = require('../../db/models');
const parseSequelizePrettier = require('../../helpers/parse.sequelize');

module.exports = class TalkResultRepository {
  constructor() {}
  // 톡 전송 결과 상세 생성
  createTalkResult = async ({
    msgid,
    phone,
    message,
    sentdate,
    status,
    rsltdate,
    rslt,
    reportdate,
    rslt_message,
    talkSendId,
  }) => {
    logger.info(`TalkResultRepository.createTalkResult Request`);
    const newTalkSends = await TalkResultDetails.create({
      msgid,
      phone,
      msgContent: message,
      sendDate: sentdate,
      sendState: status,
      resultDate: rsltdate,
      resultState: rslt,
      lastReportDate: reportdate,
      resultMessage: rslt_message,
      talkSendId,
    });
    return newTalkSends;
  };

  // 톡 상새결과 ID로 존재 확인
  getExistTalkResult = async ({ msgid }) => {
    logger.info(`TalkResultRepository.isExistTalkResultByMsgId Request`);
    const talkResult = await TalkResultDetails.findOne({ where: { msgid } });
    return talkResult;
  };
};
