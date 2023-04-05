const { logger } = require('../middlewares/logger');
const { TalkResultDetails, Clients } = require('../db/models');
const parseSequelizePrettier = require('../helpers/parse.sequelize');
const { Op } = require('sequelize');

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
    button_json,
    tpl_code,
    talkSendId,
    clientId,
    groupId,
    userId,
    companyId,
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
      buttonContent: button_json,
      tplCode: tpl_code,
      talkSendId,
      clientId,
      groupId,
      userId,
      companyId,
    });
    return newTalkSends;
  };

  // 톡 상새결과 ID로 존재 확인
  getExistTalkResultDetail = async ({
    talkResultDetailId,
    userId,
    companyId,
  }) => {
    logger.info(`TalkResultRepository.getExistTalkResultDetail Request`);
    const talkResult = await TalkResultDetails.findOne({
      where: { [Op.and]: [{ talkResultDetailId }, { userId }, { companyId }] },
    });
    return talkResult;
  };

  // 톡 상세결과 ID로 컬럼 데이터 조회
  getTalkResultByMsgId = async ({ msgid, userId, companyId }) => {
    logger.info(`TalkResultRepository.getTalkResultByMsgId Request`);
    const talkResult = await TalkResultDetails.findOne({
      where: { [Op.and]: [{ msgid }, { userId }, { companyId }] },
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
    });
    return talkResult;
  };

  // 톡 상세결과 ID로 모든 컬럼 조회
  getTalkResultByMsgId = async ({ msgid, userId, companyId }) => {
    logger.info(`TalkResultRepository.getTalkResultByMsgId Request`);
    const talkResult = await TalkResultDetails.findOne({
      where: { [Op.and]: [{ msgid }, { userId }, { companyId }] },

      include: {
        model: Clients,
        attributes: ['clientName'],
      },
      raw: true,
    });
    return talkResult;
  };
};
