const { logger } = require('../middlewares/logger');
const {
  TalkTemplates,
  TalkVariables,
  TalkTemplatesVariables,
} = require('../db/models');
const { NotFoundError } = require('../exceptions/errors');
const parseSequelizePrettier = require('../helpers/parse.sequelize');

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
  getVariablesByTemplateId = async ({ talkTemplateId }) => {
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
  // 템플릿 Id로 조회
  getTemplateById = async ({ talkTemplateId }) => {
    logger.info(`TalkTemplateRepository.getTemplateById Request`);
    const template = await TalkTemplates.findOne({
      where: { talkTemplateId },
      attributes: {
        exclude: ['talktemplateCode', 'createdAt', 'updatedAt'],
      },
    });
    return template;
  };

  // 템플릿 목록 전체 조회
  getTemplatesList = async () => {
    logger.info(`TalkTemplateRepository.getTemplatesList Request`);
    const templates = await TalkTemplates.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    return templates;
  };

  // 템플릿 Id로 변수들 상세 조회
  getTemplateVariablesById = async ({ talkTemplateId }) => {
    logger.info(`TalkTemplateRepository.getTemplateVariablesById Request`);

    const templateVariables = await TalkVariables.findAll({
      attributes: ['talkVariableId', 'talkVariableEng', 'talkVariableKor'],
      include: [
        {
          model: TalkTemplatesVariables,
          attributes: [],
          where: { talkTemplateId },
          include: [
            {
              model: TalkTemplates,
              attributes: [
                'talkTemplateId',
                'talkTemplateCode',
                'talkTemplateName',
              ],
            },
          ],
        },
      ],
      raw: true,
    }).then((model) => model.map(parseSequelizePrettier));
    return templateVariables;
  };
};
