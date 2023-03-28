const { logger } = require('../middlewares/logger');
const TalkContentRepository = require('../repositories/talkcontent.repository');
const TalkTemplateRepository = require('../repositories/talktemplate.repository');
const { BadRequestError, NotFoundError } = require('../exceptions/errors');

module.exports = class TalkTemplateService {
  constructor() {
    this.talkContentRepository = new TalkContentRepository();
    this.talkTemplateRepository = new TalkTemplateRepository();
  }

  // 템플릿 데이터 검증
  verifyTemplateData = async ({ talkTemplateId, ...talkContentData }) => {
    logger.info(`TalkTemplateService.verifyTemplateData`);
    // 템플릿 코드로 템플릿 존재여부 확인
    const existedTemplate = await this.talkTemplateRepository.getTemplateByCode(
      {
        talkTemplateCode,
      }
    );
    if (!existedTemplate) {
      throw new NotFoundError('템플릿 조회에 실패하였습니다.');
    }
    // 해당 템플릿 변수들 불러오기
    const variables =
      await this.talkTemplateRepository.getVariablesByTemplateId({
        talkTemplateId: existedTemplate.talkTemplateId,
      });
    // 입력 데이터와 템플릿 변수 일치여부 확인
    const result = variables.every((value) => {
      const currentVariable = value['talkVariableEng'];
      const inputDataArray = Object.keys(talkContentData);
      return inputDataArray.includes(currentVariable);
    });
    if (!result)
      throw new BadRequestError('입력 데이터가 템플릿과 일치하지 않습니다.');
    return result;
  };
};
