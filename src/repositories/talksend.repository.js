const { logger } = require('../middlewares/logger');
const { TalkSends, Groups } = require('../db/models');
const parseSequelizePrettier = require('../helpers/parse.sequelize');
const { Op } = require('sequelize');

module.exports = class TalkSendRepository {
  constructor() {}
  // 톡 전송 내용 생성
  createTalkSend = async ({
    clientId,
    talkContentId,
    talkTemplateId,
    userId,
    companyId,
    groupId,
    ...aligoData
  }) => {
    logger.info(`TalkSendRepository.createTalkSend Request`);
    try {
      const newTalkSends = await TalkSends.create({
        clientId,
        talkContentId,
        talkTemplateId,
        userId,
        companyId,
        groupId,
        ...aligoData,
      });
      return newTalkSends;
    } catch (e) {
      console.error(e);
      throw new Error('알림톡 발송 데이터 생성에 실패하였습니다.');
    }
  };

  // 톡 전송 결과 저장
  updateTalkSendResult = async ({
    mid,
    msgCount,
    msgContent,
    sendState,
    sendDate,
  }) => {
    logger.info(`TalkSendRepository.saveTalkSendResult Request`);
    const updatedTalkSends = await TalkSends.update(
      {
        msgCount,
        msgContent,
        sendState,
        sendDate,
      },
      { where: { mid } }
    );
    return updatedTalkSends;
  };

  // 리스트 조회용 - mid로 전송 데이터 컬럼 조회
  getTalkSendByMid = async ({ mid, groupId }) => {
    logger.info(`TalkSendRepository.getTalkSendByMid Request`);
    const talkSend = await TalkSends.findOne({
      where: { [Op.and]: groupId ? [{ mid }, { groupId }] : [{ mid }] },
      attributes: {
        // 필요 컬럼: talkSendId, mid, scnt, fcnt, msgCount, sendState, sendDate, groupId, groupName,
        exclude: [
          'code',
          'message',
          'msgContent',
          'talkContentId',
          'companyId',
          'userId',
          'createdAt',
          'updatedAt',
          'clientId',
          'talkTemplateId',
        ],
      },
      include: [
        {
          model: Groups,
          attributes: ['groupName'],
        },
      ],
      raw: true,
    }).then((model) => (model ? parseSequelizePrettier(model) : null));
    return talkSend;
  };

  // 상세조회용 - talkSendId로 전송 데이터 컬럼 조회
  getTalkSendBySendId = async ({ talkSendId }) => {
    logger.info(`TalkSendRepository.getTalkSendBySendId Request`);
    const talkSend = await TalkSends.findOne({
      where: { talkSendId },
      attributes: [
        // 필요 컬럼: talkSendId, mid, groupId, talkContentId, clientId, talkTemplateId
        'talkSendId',
        'mid',
        'groupId',
        'talkContentId',
        'clientId',
        'talkTemplateId',
      ],
      raw: true,
    }).then((model) => (model ? parseSequelizePrettier(model) : null));
    return talkSend;
  };
};
