const { logger } = require('../../middlewares/logger');
const {
  TalkTemplates,
  TalkVariables,
  TalkTemplatesVariables,
} = require('../../db/models');
const { NotFoundError } = require('../../exceptions/errors');

module.exports = class TalkTemplateRepository {
  constructor() {}
  // 템플릿 코드로 조회
  getTemplateByCode = async ({ talkTemplateCode }) => {
    logger.info(`TalkTemplateRepository.getTemplateByCode Request`);
    const template = await TalkTemplates.findOne({
      where: { talkTemplateCode },
    });
    if (!template) {
      throw new NotFoundError('템플릿 조회에 실패하였습니다.');
    }
    return template;
  };

  // 템플릿 코드에 맞는 변수 조회
  getVariablesByCode = async ({ talkTemplateId }) => {
    logger.info(`TalkTemplateRepository.getVariablesByCode Request`);
    try {
      const talkVarialbes = await TalkVariables.findAll({
        attributes: ['talkVariableId', 'talkVariableEng', 'talkVariableKor'],
        include: [
          {
            model: TalkTemplatesVariables,
            attributes: [],
            where: { talkTemplateId },
          },
        ],
      });
      return talkVarialbes;
    } catch (e) {
      console.error(e);
      throw new Error('템플릿에 맞는 변수 조회에 실패하였습니다.');
    }
  };
};
