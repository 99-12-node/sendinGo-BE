const { logger } = require('../middlewares/logger');
const ClientRepository = require('../repositories/client.repository');
const TalkContentRepository = require('../repositories/talkcontent.repository');
const TalkTemplateRepository = require('../repositories/talktemplate.repository');
const TalkSendRepository = require('../repositories/talksend.repository');
const GroupRepository = require('../repositories/group.repository');
const AligoService = require('./aligo.service');
const { BadRequestError, NotFoundError } = require('../exceptions/errors');
const aligoService = new AligoService();

module.exports = class AlimtalkSendService {
  constructor() {
    this.clientRepository = new ClientRepository();
    this.talkContentRepository = new TalkContentRepository();
    this.talkTemplateRepository = new TalkTemplateRepository();
    this.talkSendRepository = new TalkSendRepository();
    this.groupRepository = new GroupRepository();
  }

  // 알림톡 전송 내용 저장
  saveTalkContents = async ({
    clientId,
    talkTemplateCode,
    ...talkContentData
  }) => {
    logger.info(`AlimtalkSendService.saveTalkContents`);
    // 클라이언트 존재 확인
    const existClient = await this.clientRepository.getClientByClientId({
      clientId,
    });
    if (!existClient) {
      throw new NotFoundError('클라이언트 조회에 실패하였습니다.');
    }

    // 템플릿 데이터 맞는지 확인하고 템플릿 Id 반환
    const talkTemplateId = await this.talkTemplateRepository
      .getTemplateByCode({
        talkTemplateCode,
      })
      .then(async (template) => {
        // 해당 템플릿 변수들 불러오기
        const variables =
          await this.talkTemplateRepository.getVariablesByTemplateId({
            talkTemplateId: template.talkTemplateId,
          });
        // 입력 데이터와 템플릿 변수 일치여부 확인
        const result = variables.every(async (value) => {
          const currentVariable = value['talkVariableEng'];
          const inputDataArray = Object.keys(talkContentData);
          return inputDataArray.includes(currentVariable);
        });
        if (!result) {
          throw new BadRequestError(
            '입력 데이터가 템플릿과 일치하지 않습니다.'
          );
        }
        return template.talkTemplateId;
      });

    // 템필릿 전송 내용 저장
    if (talkTemplateId) {
      const result = await this.talkContentRepository.createTalkContent({
        clientId,
        talkTemplateId,
        ...talkContentData,
      });
      return {
        talkContentId: result.talkContentId,
        clientId: result.clientId,
        talkTemplateId: result.talkTemplateId,
      };
    }
  };

  //등록된 클라이언트 알림톡 전송 내용 조회
  getTalkContentsByClientId = async ({
    userId,
    companyId,
    groupId,
    clientIds,
  }) => {
    logger.info(`ClientService.getTalkContentsByClientId Request`);

    // 존재하는 그룹인지 확인
    const existGroup = await this.groupRepository.findGroupId({
      userId,
      companyId,
      groupId,
    });

    if (!existGroup) {
      throw new NotFoundError('그룹 조회에 실패하였습니다.');
    }

    const results = [];
    for (const clientId of clientIds) {
      // 존재하는 클라이언트인지 확인
      const existClient = await this.clientRepository.getClientByClientId({
        userId,
        companyId,
        clientId,
      });

      if (!existClient) {
        throw new NotFoundError('클라이언트 조회에 실패하였습니다.');
      }
      const client = await this.clientRepository.getClientByClientIdAndGroupId({
        userId,
        companyId,
        groupId,
        clientId,
      });

      const talkContent =
        await this.talkContentRepository.getContentByClientIdAndGroupId({
          userId,
          companyId,
          groupId,
          clientId,
        });
      const result = { client, talkContent };
      results.push(result);
    }
    return results;
  };

  // 알림톡 발송
  sendAlimTalk = async (datas) => {
    logger.info(`AlimtalkSendService.sendAlimTalk`);

    let talkSendDatas = [];
    let talkSendParams = [];
    for (const data of datas) {
      const { talkContentId, clientId, talkTemplateId, groupId } = data;

      // clientId, talkContentId, talkTemplateId, groupId로 데이터 조회
      const talkSendPromises = [
        await this.clientRepository.getClientByClientId({ clientId }),
        await this.talkContentRepository.getTalkContentById({ talkContentId }),
        await this.talkTemplateRepository.getTemplateById({ talkTemplateId }),
        await this.groupRepository.findGroupId({ groupId }),
      ];

      // 관련 Promise 에러 핸들링
      const talkSendPromiseData = await Promise.allSettled(talkSendPromises);
      const rawResult = talkSendPromiseData.map((result, idx) => {
        if (!result.value || result.status === 'rejected') {
          throw new NotFoundError(
            '클라이언트 or 전송내용 or 템플릿 조회를 실패하였습니다.'
          );
        }
        return result;
      });

      const [client, talkcontent, talkTemplate, group] = talkSendPromises;

      // 위 데이터로 알리고로 전송 요청을 위한 파라미터 만들기
      const talksendAligoParams = {
        talkTemplateCode: talkTemplate.talkTemplateCode,
        receiver: client.contact,
        recvname: client.clientName,
        subject: group.groupName,
        message: talkTemplate.talkTemplateContent,
        talkSendData: talkcontent,
      };
      talkSendDatas.push(talksendAligoParams);
    }

    // 파라미터로 알리고에 알림톡 전송 요청
    const aligoResult = await aligoService.sendAlimTalk(talkSendDatas);

    // 요청 받은 응답 데이터와 알림톡 전송 파라미터 반환
    for (const data of datas) {
      const { talkContentId, clientId, talkTemplateId, groupId } = data;
      const talkSend = { talkContentId, clientId, talkTemplateId, groupId };
      talkSendParams.push(talkSend);
    }
    return {
      message: '성공적으로 전송요청 하였습니다.',
      aligoResult,
      talkSend: [...talkSendParams],
    };
  };

  // 알림톡 발송 요청 응답 데이터 저장
  saveSendAlimTalkResponse = async ({ data }) => {
    logger.info(`AlimtalkSendService.saveSendAlimTalkResponse`);
    const { aligoResult, talkSend } = data;
    let result = [];
    for (const send of talkSend) {
      const { code, message } = aligoResult;
      const { talkContentId, clientId, talkTemplateId, groupId } = send;
      const newTalkSend = await this.talkSendRepository.createTalkSend({
        talkContentId,
        clientId,
        talkTemplateId,
        groupId,
        code,
        message,
        mid: aligoResult.info.mid,
        scnt: aligoResult.info.scnt,
        fcnt: aligoResult.info.fcnt,
      });
      result.push(newTalkSend);
    }
    return result;
  };
};
