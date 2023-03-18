const { logger } = require('../../middlewares/logger');
const {
  TalkContents,
  TalkTemplates,
  TalkVariables,
  TalkTemplatesVariables,
} = require('../../db/models');

module.exports = class TalkTemplateRepository {
  constructor() {}
  // 템플릿 코드로 조회
  getTemplateByCode = async ({ talkTemplateCode }) => {
    logger.info(`TalkTemplateRepository.getTemplateByCode Request`);
    const template = await TalkTemplates.findOne({
      where: { talkTemplateCode },
    });
    return template;
  };

  // 템플릿 코드에 맞는 변수 조회
  getVariablesByCode = async ({ talkTemplateId }) => {
    logger.info(`TalkTemplateRepository.getVariablesByCode Request`);
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
  };
};
