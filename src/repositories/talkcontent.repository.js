const { logger } = require('../middlewares/logger');
const { Clients, TalkContents, sequelize, Groups } = require('../db/models');
const { Op } = require('sequelize');
const parseSequelizePrettier = require('../helpers/parse.sequelize');

module.exports = class TalkContentRepository {
  constructor() {}
  // 톡 전송 내용 생성
  createTalkContent = async ({
    userId,
    companyId,
    groupId,
    clientId,
    talkTemplateId,
    ...talkContentData
  }) => {
    logger.info(`TalkContentRepository.createTalkContent Request`);
    try {
      const newTalkContent = await TalkContents.create({
        userId,
        companyId,
        groupId,
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

  // 톡 전송 내용 Id로 조회
  getTalkContentById = async ({ userId, companyId, talkContentId }) => {
    logger.info(`TalkContentRepository.getTalkContent Request`);
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
  getContentByClientIdAndGroupId = async ({
    userId,
    companyId,
    groupId,
    clientId,
  }) => {
    logger.info(`TalkContentRepository.getContentByClientIdAndGroupId Request`);
    const client = await TalkContents.findOne({
      attributes: {
        exclude: [
          'clientId',
          'userId',
          'companyId',
          'groupId',
          'createdAt',
          'updatedAt',
        ],
      },
      where: {
        [Op.and]: [{ userId }, { companyId }, { groupId }, { clientId }],
      },
      raw: true,
    });
    // .then((model) => parseSequelizePrettier(model));
    return client;
  };
};
