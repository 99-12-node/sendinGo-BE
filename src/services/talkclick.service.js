const { logger } = require('../middlewares/logger');
const TalkClickRepository = require('../repositories/talkclick.repository');

module.exports = class TalkClickService {
  constructor() {
    this.talkClickRepository = new TalkClickRepository();
  }

  // 톡버튼 클릭 생성
  createTalkClick = async ({ trackingUUID }) => {
    logger.info(`TalkClickService.createTalkClick Request`);
    // redis에서 trackingUUID 값 가져오기
    const value = await this.talkClickRepository.getValueByTrackingUUID({
      trackingUUID,
    });
    const {
      userId,
      companyId,
      groupId,
      clientId,
      talkSendId,
      talkResultDetailId,
    } = value;
    // 버튼 클릭 DB 생성
    const newTalkClick = await this.talkClickRepository.createTalkClick({
      userId,
      companyId,
      groupId,
      clientId,
      talkSendId,
      talkResultDetailId,
      trackingUrl: trackingUUID,
    });
    return newTalkClick;
  };
};
