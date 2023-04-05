const { logger } = require('../middlewares/logger');
const { NotFoundError, BadRequestError } = require('../exceptions/errors');
const TalkResultRepository = require('../repositories/talkresult.repository');
const TalkSendRepository = require('../repositories/talksend.repository');
const TalkContentRepository = require('../repositories/talkcontent.repository');
const TalkClickRepository = require('../repositories/talkclick.repository');

module.exports = class AlimtalkResultService {
  constructor() {
    this.talkSendRepository = new TalkSendRepository();
    this.talkResultRepository = new TalkResultRepository();
    this.talkContentRepository = new TalkContentRepository();
    this.talkClickRepository = new TalkClickRepository();
  }

  // 알림톡 전송 결과 저장
  saveAlimTalkResult = async (results, groupId, userId, companyId) => {
    logger.info(`AlimtalkResultService.saveAlimTalkResult`);

    const response = [];
    try {
      for (const result of results) {
        const { mid, msgCount, msgContent, sendState, sendDate } = result;
        // 존재하는 전송 결과인지 확인
        const existTalkSend = await this.talkSendRepository.getTalkSendByMid({
          mid,
          groupId,
          userId,
          companyId,
        });

        // 존재하는 경우에만 해당 전송 결과 데이터 업데이트
        if (existTalkSend) {
          const updatedDataCount =
            await this.talkSendRepository.updateTalkSendResult({
              mid: existTalkSend.mid,
              msgCount,
              msgContent,
              sendState,
              sendDate,
            });
          // 업데이트된 TalkSend 반환
          const updatedTalkSend =
            await this.talkSendRepository.getTalkSendByMid({
              mid: existTalkSend.mid,
              groupId,
              userId,
              companyId,
            });
          const { mid, ...talkSendData } = updatedTalkSend;
          response.push(talkSendData);
        }
      }
      return response;
    } catch (e) {
      console.error(e);
    }
  };

  // 알림톡 전송 상세 결과 저장
  saveTalkResultDetail = async ({
    results,
    talkSendData,
    userId,
    companyId,
  }) => {
    logger.info(`AlimtalkResultService.saveTalkResultDetail`);
    const { talkSendId, clientId, groupId, talkContentId } = talkSendData;

    const response = [];
    for (const result of results) {
      const { msgid } = result;

      const existTalkResult =
        await this.talkResultRepository.getTalkResultByMsgId({
          msgid,
          userId,
          companyId,
        });
      // 이미 상세 결과가 DB에 있는 경우, 원하는 컬럼만 조회
      if (existTalkResult) {
        const talkResult = await this.talkResultRepository.getTalkResultByMsgId(
          { msgid, userId, companyId }
        );
        response.push(talkResult);

        const talkContent = await this.talkContentRepository.getTalkContentById(
          {
            userId,
            companyId,
            talkContentId,
          }
        );
        // resultDetailId 값 redis에 업데이트 redis에 저장
        await this.talkClickRepository.saveTrackingUUID({
          trackingUUID: talkContent.trackingUUID,
          userId,
          companyId,
          groupId,
          clientId,
          talkContentId,
          talkSendId,
          talkResultDetailId: existTalkResult.talkResultDetailId,
        });
      } else {
        // DB에 없다면, 전송 상세 결과 DB에 생성
        const talkResultData = await this.talkResultRepository.createTalkResult(
          {
            ...result,
            talkSendId,
            clientId,
            groupId,
            userId,
            companyId,
          }
        );

        const talkContent = await this.talkContentRepository.getTalkContentById(
          {
            userId,
            companyId,
            talkContentId,
          }
        );
        console.log('talkContent : ', talkContent);
        // resultDetailId 값 redis에 업데이트 redis에 저장
        await this.talkClickRepository.saveTrackingUUID({
          trackingUUID: talkContent.trackingUUID,
          userId,
          companyId,
          groupId,
          clientId,
          talkContentId,
          talkSendId,
          talkResultDetailId: talkResultData.talkResultDetailId,
        });
        // 원하는 결과 상세 데이터 컬럼 반환
        const talkResult = await this.talkResultRepository.getTalkResultByMsgId(
          {
            msgid: talkResultData.msgid,
            userId,
            companyId,
          }
        );
        response.push(talkResult);
      }
    }
    return response;
  };

  // talkSendId로 전송 데이터 조회
  getTalkSendBySendId = async ({ talkSendId, userId, companyId }) => {
    logger.info(`AlimtalkResultService.getTalkSendBySendId`);

    // talkTemplateId, ClientId, talkSendId 찾기
    const talkSend = await this.talkSendRepository.getTalkSendBySendId({
      talkSendId,
      userId,
      companyId,
    });

    if (!talkSend) {
      throw new NotFoundError('해당하는 전송 데이터를 찾을 수 없습니다.');
    }
    const talkSendResultData = {
      talkSendId: talkSend.talkSendId,
      clientId: talkSend.clientId,
      talkTemplateId: talkSend.talkTemplateId,
      groupId: talkSend.groupId,
      talkContentId: talkSend.talkContentId,
      mid: talkSend.mid,
    };
    return talkSendResultData;
  };
};
