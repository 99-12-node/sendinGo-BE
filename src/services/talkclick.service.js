const { logger } = require('../middlewares/logger');
const TalkClickRepository = require('../repositories/talkclick.repository');
const TalkContentRepository = require('../repositories/talkcontent.repository');

module.exports = class TalkClickService {
  constructor() {
    this.talkClickRepository = new TalkClickRepository();
    this.talkContentRepositoy = new TalkContentRepository();
  }

  // 톡버튼 클릭 생성
  createTalkClick = async ({ trackingUUID, ua, originUrl }) => {
    logger.info(`TalkClickService.createTalkClick Request`);
    const { browser, os, device } = ua;
    const clickBrowser = JSON.stringify(browser);
    const clickOs = JSON.stringify(os);
    const clickDevice = JSON.stringify(device);

    // redis에서 trackingUUID 값 가져오기
    const value = await this.talkClickRepository.getValueByTrackingUUID({
      trackingUUID,
    });
    // originLink 조회
    const talkContent = await this.talkContentRepositoy.getTalkContentInNoAuth({
      talkContentId: value.talkContentId,
    });

    // 버튼 클릭 DB 생성
    const newTalkClick = await this.talkClickRepository.createTalkClick({
      clickBrowser,
      clickOs,
      clickDevice,
      originLink: talkContent.useLink,
      trackingUrl: originUrl,
      ...value,
    });
    return newTalkClick;
  };
};
