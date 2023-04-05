const { logger } = require('../middlewares/logger');
const ClientRepository = require('../repositories/client.repository');
const TalkContentRepository = require('../repositories/talkcontent.repository');
const TalkTemplateRepository = require('../repositories/talktemplate.repository');
const TalkSendRepository = require('../repositories/talksend.repository');
const GroupRepository = require('../repositories/group.repository');
const { BadRequestError, NotFoundError } = require('../exceptions/errors');
const { redisClient, redisSet, redisGet } = require('../db/config/redis');
require('dotenv').config();
const { API_DOMAIN, PORT } = process.env;

const { v4: uuidv4 } = require('uuid');

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
    userId,
    companyId,
    groupId,
    clientId,
    talkTemplateId,
    ...talkContentData
  }) => {
    logger.info(`AlimtalkSendService.saveTalkContents`);
    // 클라이언트 존재 확인
    const existClient = await this.clientRepository.getClientByClientId({
      userId,
      companyId,
      clientId,
    });
    if (!existClient) {
      throw new NotFoundError('클라이언트 조회에 실패하였습니다.');
    }

    // 그룹 존재 확인
    const existGroup = await this.groupRepository.findGroupId({
      userId,
      companyId,
      groupId,
    });
    if (!existGroup) {
      throw new NotFoundError('그룹 조회에 실패하였습니다.');
    }

    // 템플릿 존재 확인
    const existTalkTemplate = await this.talkTemplateRepository.getTemplateById(
      { talkTemplateId }
    );
    if (!existTalkTemplate) {
      throw new NotFoundError('템플릿 조회에 실패하였습니다.');
    }

    // 해당 템플릿 변수들 불러오기
    const variables =
      await this.talkTemplateRepository.getVariablesByTemplateId({
        talkTemplateId: existTalkTemplate.talkTemplateId,
      });
    // 입력 데이터와 템플릿 변수 일치여부 확인
    const result = variables.every((value) => {
      const currentVariable = value['talkVariableEng'];
      const inputDataArray = Object.keys(talkContentData);
      return inputDataArray.includes(currentVariable);
    });
    if (!result) {
      throw new BadRequestError('입력 데이터가 템플릿과 일치하지 않습니다.');
    }

    // 템플릿 전송 내용 저장
    const newTalkContent = await this.talkContentRepository.createTalkContent({
      userId,
      companyId,
      clientId: existClient.clientId,
      talkTemplateId: existTalkTemplate.talkTemplateId,
      ...talkContentData,
    });
    return {
      talkContentId: newTalkContent.talkContentId,
      clientId: newTalkContent.clientId,
      groupId: existGroup.groupId,
      talkTemplateId: newTalkContent.talkTemplateId,
    };
  };

  //등록된 클라이언트 알림톡 전송 내용 조회
  getContentByClientIds = async ({ userId, companyId, groupId, clientIds }) => {
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
      if (!client) {
        throw new NotFoundError('클라이언트 조회에 실패하였습니다.');
      }

      const talkContent = await this.talkContentRepository.getContentByClientId(
        {
          userId,
          companyId,
          clientId,
        }
      );
      if (!talkContent) {
        throw new NotFoundError('전송 내용 조회에 실패하였습니다.');
      }
      const result = { client, talkContent };
      results.push(result);
    }
    return results;
  };

  // 알림톡 발송 데이터 준비
  setSendAlimTalkData = async (userId, companyId, datas) => {
    logger.info(`AlimtalkSendService.setSendAlimTalkData`);

    const talksendAligoParams = [];
    const talkSendDatas = [];

    for (const data of datas) {
      const { talkContentId, clientId, talkTemplateId, groupId } = data;

      // clientId, talkContentId, talkTemplateId, groupId로 데이터 조회
      const talkSendPromises = [
        await this.clientRepository.getClientByClientId({
          userId,
          companyId,
          clientId,
        }),
        await this.talkContentRepository.getTalkContentById({
          userId,
          companyId,
          talkContentId,
        }),
        await this.talkTemplateRepository.getTemplateById({ talkTemplateId }),
        await this.groupRepository.findGroupId({ userId, companyId, groupId }),
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

      if (parseInt(talkTemplateId) === 4) {
        const trackingUUID = uuidv4();
        const trackingUrl = `dev.sendingo-be.store/api/talk/click/${trackingUUID}`;

        // 전송 내용에 트래킹 URL 생성
        const updateTalkContent =
          await this.talkContentRepository.updateTalkContentById({
            talkContentId,
            trackingUUID,
            trackingUrl,
          });

        // 발송 전 트래킹을 위한 식별값 redis에 저장
        await redisSet(
          trackingUUID,
          JSON.stringify({
            userId,
            companyId,
            groupId,
            clientId,
            talkContentId,
          })
        );
      }

      // 위 데이터로 알리고로 전송 요청을 위한 파라미터 만들기
      const talksendAligoParam = {
        talkTemplateCode: talkTemplate.talkTemplateCode,
        receiver: client.contact,
        recvname: client.clientName,
        subject: group.groupName,
        message: talkTemplate.talkTemplateContent,
        talkSendData: talkcontent,
      };
      talksendAligoParams.push(talksendAligoParam);
      talkSendDatas.push(data);
    }

    return { talksendAligoParams, talkSendDatas };
  };

  // 알림톡 발송 요청 응답 데이터 저장
  saveSendAlimTalkResponse = async ({ userId, companyId, data }) => {
    logger.info(`AlimtalkSendService.saveSendAlimTalkResponse`);
    const { aligoResult, talkSend } = data;
    const result = [];
    for (const send of talkSend) {
      const { code, message } = aligoResult;
      const { talkContentId, clientId, talkTemplateId, groupId } = send;
      const newTalkSend = await this.talkSendRepository.createTalkSend({
        talkContentId,
        clientId,
        talkTemplateId,
        userId,
        companyId,
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
