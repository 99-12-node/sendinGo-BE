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
        talkTemplateId,
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

  // 템플릿 목록 전체 조회
  getTemplatesList = async () => {
    logger.info(`TalkTemplateService.getTemplatesList`);

    // 템플릿 전체 불러오기
    const allData = await this.talkTemplateRepository.getTemplatesList();

    // 필요한 템플릿만 조회 (1,4번 제외)
    return allData.filter(
      (data) => data.talkTemplateId !== 1 && data.talkTemplateId !== 4
    );
  };

  // 템플릿 ID로 변수들 상세 조회
  getTemplateVariablesById = async ({ talkTemplateId }) => {
    logger.info(`TalkTemplateService.getTemplateVariablesById`);

    const existedTemplate = await this.talkTemplateRepository.getTemplateById({
      talkTemplateId,
    });
    if (!existedTemplate) {
      throw new NotFoundError('템플릿 조회에 실패하였습니다.');
    }

    // 템플릿 전체 불러오기
    const data = await this.talkTemplateRepository.getTemplateVariablesById({
      talkTemplateId,
    });

    return data;
  };
};
