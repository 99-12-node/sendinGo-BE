const { logger } = require('../../middlewares/logger');
const { TalkSends, Groups } = require('../../db/models');
const parseSequelizePrettier = require('../../helpers/parse.sequelize');

module.exports = class TalkSendRepository {
  constructor() {}
  // 톡 전송 내용 생성
  createTalkSend = async ({
    clientId,
    talkContentId,
    talkTemplateId,
    groupId,
    ...aligoData
  }) => {
    logger.info(`TalkSendRepository.createTalkSend Request`);
    try {
      const newTalkSends = await TalkSends.create({
        clientId,
        talkContentId,
        talkTemplateId,
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

  // 톡 전송 ID로 조회
  getTalkSendById = async ({ mid }) => {
    logger.info(`TalkSendRepository.saveTalkSendById Request`);
    const talkSend = await TalkSends.findOne({
      where: { mid },
      attributes: {
        // 필요 컬럼: talkSendId, groupId, groupName, mid, scnt, fcnt, msgCount, sendState, sendDate
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
};
