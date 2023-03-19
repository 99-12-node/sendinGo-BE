const { logger } = require('../../middlewares/logger');
const { Clients, TalkContents } = require('../../db/models');

module.exports = class TalkContentRepository {
  constructor() {}
  // 톡 전송 내용 생성
  createTalkContent = async ({
    clientId,
    talkTemplateId,
    ...talkContentData
  }) => {
    logger.info(`TalkContentRepository.createTalkContent Request`);
    try {
      const newTalkContent = await TalkContents.create({
        clientId,
        talkTemplateId,
        ...talkContentData,
      });
      return newTalkContent;
    } catch (e) {
      console.error(e);
      throw new Error('전송 내용 저장에 실패하였습니다.');
    }
  };
};
