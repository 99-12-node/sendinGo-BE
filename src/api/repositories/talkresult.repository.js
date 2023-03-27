const { logger } = require('../../middlewares/logger');
const { TalkResultDetails, Clients } = require('../../db/models');
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
    clientId,
    groupId,
    // userId, companyId
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
      clientId,
      groupId,
      // userId, companyId
    });
    return newTalkSends;
  };

  // 톡 상새결과 ID로 존재 확인
  getExistTalkResult = async ({ msgid }) => {
    logger.info(`TalkResultRepository.isExistTalkResultByMsgId Request`);
    const talkResult = await TalkResultDetails.findOne({ where: { msgid } });
    return talkResult;
  };

  // 톡 상세결과 ID로 컬럼 데이터 조회
  getTalkResultByMsgId = async ({ msgid }) => {
    logger.info(`TalkResultRepository.getTalkResultByMsgId Request`);
    const talkResult = await TalkResultDetails.findOne({
      where: { msgid },
      attributes: [
        'talkResultDetailId',
        'talkSendId',
        'phone',
        'msgContent',
        'sendDate',
        'resultState',
        'resultMessage',
        'resultDate',
        'groupId',
        'clientId',
      ],
      include: {
        model: Clients,
        attributes: ['clientName'],
      },
      raw: true,
    }).then((model) => parseSequelizePrettier(model));
    return talkResult;
  };
};
