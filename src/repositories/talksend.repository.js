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
    ccnt,
    msgContent,
    sendState,
    sendDate,
  }) => {
    logger.info(`TalkSendRepository.updateTalkSendResult Request`);
    const updatedTalkSends = await TalkSends.update(
      {
        msgCount,
        ccnt,
        msgContent,
        sendState,
        sendDate,
      },
      { where: { mid } },
      { plain: true }
    );
    return updatedTalkSends;
  };

  //mid로 전송 내용 존재 조회
  getExistTalkSendByMid = async ({ mid, groupId, userId, companyId }) => {
    logger.info(`TalkSendRepository.getExistTalkSendByMid Request`);
    const talkSend = await TalkSends.findOne({
      where: {
        [Op.and]: [{ mid }, { userId }, { companyId }, { groupId }],
      },
      attributes: [
        'talkSendId',
        'mid',
        'scnt',
        'fcnt',
        'msgCount',
        'userId',
        'companyId',
        'groupId',
        'talkContentId',
        'talkTemplateId',
      ],
      include: [
        {
          model: Groups,
          attributes: ['groupName'],
        },
      ],
      raw: true,
    });
    return talkSend;
  };

  // 전송 결과 리스트 조회 (mid로 그룹)
  getTalkSendByMidAndGroup = async ({ mid, userId, companyId, groupId }) => {
    logger.info(`TalkSendRepository.getTalkSendByMidAndGroup Request`);

    const talkSend = await TalkSends.findOne({
      where: {
        [Op.and]: groupId
          ? [{ mid }, { userId }, { companyId }, { groupId }]
          : [{ mid }],
      },
      attributes: {
        // 필요 컬럼: talkSendId, mid, scnt, fcnt, ccnt, msgCount, sendState, sendDate, groupId, groupName,
        exclude: [
          'code',
          'mid',
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
  getTalkSendBySendId = async ({ talkSendId, userId, companyId }) => {
    logger.info(`TalkSendRepository.getTalkSendBySendId Request`);
    const talkSend = await TalkSends.findOne({
      where: { [Op.and]: [{ talkSendId }, { userId }, { companyId }] },
      raw: true,
    });
    return talkSend;
  };

  // 상세조회용 - mid로 전송 데이터 리스트
  getExistTalkSendListByMid = async ({ mid, userId, companyId }) => {
    logger.info(`TalkSendRepository.getExistTalkSendListByMid Request`);
    const talkSend = await TalkSends.findAll({
      where: { [Op.and]: [{ mid }, { userId }, { companyId }] },
      raw: true,
    }).then((model) => (model ? model.map(parseSequelizePrettier) : []));
    return talkSend;
  };

  // 그룹리스트 - 클릭건수 합산
  getTalkSendClickCountByMid = async ({ mid, userId, companyId }) => {
    logger.info(`TalkSendRepository.getTalkSendClickCountByMid Request`);
    const talkSendClickCount = await TalkSends.sum('ccnt', {
      where: { [Op.and]: [{ mid }, { userId }, { companyId }] },
    });
    return talkSendClickCount;
  };
};
