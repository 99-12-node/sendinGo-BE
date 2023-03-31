const { logger } = require('../middlewares/logger');
const { NotFoundError } = require('../exceptions/errors');
const TalkResultRepository = require('../repositories/talkresult.repository');
const TalkSendRepository = require('../repositories/talksend.repository');

module.exports = class AlimtalkResultService {
  constructor() {
    this.talkSendRepository = new TalkSendRepository();
    this.talkResultRepository = new TalkResultRepository();
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
  saveTalkResultDetail = async ({ results, talkSendData }) => {
    logger.info(`AlimtalkResultService.saveTalkResultDetail`);

    const { talkSendId, clientId, groupId } = talkSendData;

    let response = [];
    for (const result of results) {
      const { msgid } = result;

      const existTalkResult =
        await this.talkResultRepository.getExistTalkResult({
          msgid,
        });
      // 이미 상세 결과가 DB에 있는 경우, 원하는 컬럼만 조회
      if (existTalkResult) {
        const talkResult = await this.talkResultRepository.getTalkResultByMsgId(
          { msgid }
        );
        response.push(talkResult);
      } else {
        // DB에 없다면, 전송 상세 결과 DB에 생성
        const talkResultData = await this.talkResultRepository.createTalkResult(
          {
            ...result,
            talkSendId,
            clientId,
            groupId,
          }
        );

        const talkResult = await this.talkResultRepository.getTalkResultByMsgId(
          {
            msgid: talkResultData.msgid,
          }
        );
        response.push(talkResult);
      }
    }
    return response;
  };

  // talkSendId로 전송 데이터 조회
  getTalkSendBySendId = async ({ talkSendId }) => {
    logger.info(`AlimtalkResultService.getTalkSendBySendId`);

    // talkTemplateId, ClientId, talkSendId 찾기
    const talkSend = await this.talkSendRepository.getTalkSendBySendId({
      talkSendId,
    });

    if (!talkSend) {
      throw new NotFoundError('해당하는 전송 데이터를 찾을 수 없습니다.');
    }
    const talkSendResultData = {
      talkSendId: talkSend.talkSendId,
      clientId: talkSend.clientId,
      talkTemplateId: talkSend.talkTemplateId,
      groupId: talkSend.groupId,
      mid: talkSend.mid,
    };
    return talkSendResultData;
  };
};
