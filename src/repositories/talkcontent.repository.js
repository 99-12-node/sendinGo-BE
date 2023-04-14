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
    ...talkContentData
  }) => {
    logger.info(`TalkContentRepository.createTalkContent Request`);
    const newTalkContent = await TalkContents.create({
      userId,
      companyId,
      clientId,
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
          exclude: ['talkTemplateId', 'createdAt', 'updatedAt'],
        },
      });
      return talkcontent;
    } catch (e) {
      console.error(e);
      throw new Error('Id로 조회에 실패하였습니다.');
    }
  };

  // clientId로 등록된 클라이언트 조회
  getContentByClientId = async ({ userId, companyId, clientId }) => {
    logger.info(`TalkContentRepository.getContentByClientId Request`);
    const client = await TalkContents.findOne({
      attributes: {
        exclude: [
          'clientId',
          'userId',
          'companyId',
          'trackingUUID',
          'trackingUrl',
          'updatedAt',
        ],
      },
      where: {
        [Op.and]: [{ userId }, { companyId }, { clientId }],
      },
      order: [['createdAt', 'DESC']],
      raw: true,
    });
    return client;
  };

  // contentId로 정보 업데이트
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

  // 인증 및 인가 없이 contentId로 조회
  getTalkContentInNoAuth = async ({ talkContentId }) => {
    logger.info(`TalkContentRepository.getTalkContentInNoAuth Request`);
    const talkcontent = await TalkContents.findOne({
      where: { talkContentId },
    });
    return talkcontent;
  };

  // 고객 ID와 템플릿 ID로 content 업데이트
  updateContentByExistClient = async ({
    userId,
    companyId,
    clientId,
    ...talkContentData
  }) => {
    logger.info(`TalkContentRepository.updateContentByExistClient Request`);
    const updatedTalkContent = await TalkContents.update(
      { ...talkContentData },
      {
        where: {
          [Op.and]: [{ userId }, { companyId }, { clientId }],
        },
      }
    );
    return updatedTalkContent;
  };
};
