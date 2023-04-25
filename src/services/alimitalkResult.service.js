const { logger } = require('../middlewares/logger');
const { NotFoundError, BadRequestError } = require('../exceptions/errors');
const TalkResultRepository = require('../repositories/talkresult.repository');
const TalkSendRepository = require('../repositories/talksend.repository');
const TalkContentRepository = require('../repositories/talkcontent.repository');
const TalkClickRepository = require('../repositories/talkclick.repository');

const CLICKED = '클릭';
const UNCLICKED = '클릭 안함';

module.exports = class AlimtalkResultService {
  constructor() {
    this.talkSendRepository = new TalkSendRepository();
    this.talkResultRepository = new TalkResultRepository();
    this.talkContentRepository = new TalkContentRepository();
    this.talkClickRepository = new TalkClickRepository();
  }

  // 알림톡 전송 결과 저장
  saveAlimTalkResult = async ({ talkResult, groupId, userId, companyId }) => {
    logger.info(`AlimtalkResultService.saveAlimTalkResult`);

    const { mid, msgCount, msgContent, sendState, sendDate } = talkResult;
    // 존재하는 전송 결과인지 확인
    const existTalkSend = await this.talkSendRepository.getExistTalkSendByMid({
      mid,
      groupId,
      userId,
      companyId,
    });

    // 존재하는 경우에만 해당 전송 결과 데이터 업데이트
    if (existTalkSend) {
      // 클릭 건수 카운팅
      const clickCount =
        await this.talkClickRepository.getClickCountByGroupAndSendId({
          groupId,
          talkSendId: existTalkSend.talkSendId,
        });

      const updatedDataCount =
        await this.talkSendRepository.updateTalkSendResult({
          mid,
          msgCount,
          ccnt: existTalkSend.talkTemplateId === 4 ? clickCount.length : null,
          msgContent,
          sendState,
          sendDate,
        });

      // 업데이트된 TalkSend 반환
      const updatedTalkSend =
        await this.talkSendRepository.getTalkSendByMidAndGroup({
          mid,
          userId,
          companyId,
          groupId,
        });

      const talkSendClickCount =
        await this.talkSendRepository.getTalkSendClickCountByMid({
          mid,
          userId,
          companyId,
        });
      updatedTalkSend.ccnt = talkSendClickCount;
      return updatedTalkSend;
    }
  };

  // 알림톡 전송 상세 결과 저장
  saveTalkResultDetail = async ({
    result,
    talkSendData,
    userId,
    companyId,
  }) => {
    logger.info(`AlimtalkResultService.saveTalkResultDetail`);

    const { msgid } = result;
    const { talkSendId, clientId, groupId, talkContentId, talkTemplateId } =
      talkSendData;

    const existTalkResult =
      await this.talkResultRepository.getTalkResultByMsgId({
        msgid,
        userId,
        companyId,
      });

    // 이미 상세 결과가 DB에 있는 경우, 원하는 컬럼만 조회
    if (existTalkResult) {
      // 버튼형 템플릿의 useLink 가져오기
      if (existTalkResult.buttonContent) {
        const buttonTalkContent =
          await this.talkContentRepository.getTalkContentById({
            talkContentId,
            userId,
            companyId,
          });
        existTalkResult.buttonContent = buttonTalkContent.useLink;
        // 클릭정보 가져오기
        const talkClick =
          await this.talkClickRepository.getClickInfoByResultDetailId({
            talkResultDetailId: existTalkResult.talkResultDetailId,
          });
        existTalkResult.isClicked = talkClick ? CLICKED : UNCLICKED;
        existTalkResult.clickCreatedAt = talkClick
          ? talkClick.createdAt.toLocaleString('ko-KR')
          : null;
      }
      return existTalkResult;
    } else {
      // DB에 없다면, 전송 상세 결과 DB에 생성
      const talkResultData = await this.talkResultRepository.createTalkResult({
        ...result,
        talkSendId,
        clientId,
        groupId,
        userId,
        companyId,
      });
      // 버튼형 템플릿 트래킹
      if (talkTemplateId === 4) {
        await this.talkClickRepository.saveTrackingUUIDByContentId({
          talkContentId,
          userId,
          companyId,
          groupId,
          clientId,
          talkSendId,
          talkResultDetailId: talkResultData.talkResultDetailId,
        });
      }

      // 원하는 결과 상세 데이터 컬럼 반환
      const talkResult = await this.talkResultRepository.getTalkResultByMsgId({
        msgid,
        userId,
        companyId,
      });

      // 버튼형 템플릿의 useLink 가져오기
      if (talkResult.buttonContent) {
        const buttonTalkContent =
          await this.talkContentRepository.getTalkContentById({
            talkContentId,
            userId,
            companyId,
          });
        talkResult.buttonContent = buttonTalkContent.useLink;
        // 클릭정보 가져오기
        const talkClick =
          await this.talkClickRepository.getClickInfoByResultDetailId({
            talkResultDetailId: talkResultData.talkResultDetailId,
          });
        talkResultData.isClicked = talkClick ? CLICKED : UNCLICKED;
        talkResultData.clickCreatedAt = talkClick
          ? talkClick.createdAt.toLocaleString('ko-KR')
          : null;
      }
      return talkResult;
    }
  };

  // talkSendId로 전송 데이터 조회
  getTalkSendListBySendId = async ({ talkSendId, userId, companyId }) => {
    logger.info(`AlimtalkResultService.getTalkSendListBySendId`);

    // talkTemplateId, ClientId, talkSendId 찾기
    const talkSend = await this.talkSendRepository.getTalkSendBySendId({
      talkSendId,
      userId,
      companyId,
    });

    if (!talkSend) {
      throw new NotFoundError('해당하는 전송 데이터를 찾을 수 없습니다.');
    }

    const talkSendList =
      await this.talkSendRepository.getExistTalkSendListByMid({
        mid: talkSend.mid,
        userId,
        companyId,
      });
    return talkSendList;
  };
};
