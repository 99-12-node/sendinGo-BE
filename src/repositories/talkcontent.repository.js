const { logger } = require('../middlewares/logger');
const { TalkContents } = require('../db/models');
const { Op } = require('sequelize');

module.exports = class TalkContentRepository {
  constructor() {}
  // 톡 전송 내용 생성
  createTalkContent = async ({
    userId,
    companyId,
    clientId,
    talkTemplateId,
    ...talkContentData
  }) => {
    logger.info(`TalkContentRepository.createTalkContent Request`);
    const newTalkContent = await TalkContents.create({
      userId,
      companyId,
      clientId,
      talkTemplateId,
      ...talkContentData,
    });
    return newTalkContent;
  };

  // 톡 전송 내용 Id로 조회
  getTalkContentById = async ({ userId, companyId, talkContentId }) => {
    logger.info(`TalkContentRepository.getTalkContentById Request`);
    try {
      const talkcontent = await TalkContents.findOne({
        where: { [Op.and]: [{ userId }, { companyId }, { talkContentId }] },
        attributes: {
          exclude: ['clientId', 'talkTemplateId', 'createdAt', 'updatedAt'],
        },
      });
      return talkcontent;
    } catch (e) {
      console.error(e);
      throw new Error('Id로 조회에 실패하였습니다.');
    }
  };

  // clientId, groupId로 등록된 클라이언트 조회
  getContentByClientId = async ({ userId, companyId, clientId }) => {
    logger.info(`TalkContentRepository.getContentByClientId Request`);
    const client = await TalkContents.findOne({
      attributes: {
        exclude: ['clientId', 'userId', 'companyId', 'updatedAt'],
      },
      where: {
        [Op.and]: [{ userId }, { companyId }, { clientId }],
      },
      order: [['createdAt', 'DESC']],
      raw: true,
    });
    return client;
  };

  updateTalkContentById = async ({ talkContentId, ...talkContentData }) => {
    logger.info(`TalkContentRepository.updateTalkContentById Request`);
    const newTalkContent = await TalkContents.update(
      { ...talkContentData },
      {
        where: {
          talkContentId,
        },
      }
    );
    return newTalkContent;
  };
};
