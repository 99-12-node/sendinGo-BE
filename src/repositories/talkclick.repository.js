const { logger } = require('../middlewares/logger');
const { TalkClickResults, TalkContents } = require('../db/models');
const parseSequelizePrettier = require('../helpers/parse.sequelize');
const { Op } = require('sequelize');
const { redisSet, redisGet } = require('../db/config/redis');

module.exports = class TalkClickRepository {
  constructor() {}
  // 클릭결과 생성
  createTalkClick = async ({
    clickBrowser,
    clickOs,
    clickDevice,
    originLink,
    trackingUrl,
    ...value
  }) => {
    logger.info(`TalkClickRepository.createTalkClick Request`);
    const newTalkClick = await TalkClickResults.create({
      clickBrowser,
      clickOs,
      clickDevice,
      originLink,
      trackingUrl,
      ...value,
    });
    return newTalkClick;
  };

  // 트래킹 데이터 생성
  saveTrackingUUID = async ({ trackingUUID, ...ids }) => {
    logger.info(`TalkClickRepository.saveTrackingUUID Request`);
    await redisSet(
      trackingUUID,
      JSON.stringify({
        ...ids,
      })
    );
    return;
  };

  // talkContentID로 트래킹 데이터 업데이트
  saveTrackingUUIDByContentId = async ({ talkContentId, ...ids }) => {
    logger.info(`TalkClickRepository.saveTrackingUUIDByContentId Request`);
    const existTalkContent = await TalkContents.findOne({
      where: { talkContentId },
    });
    const trackingUUID = existTalkContent.trackingUUID;
    await redisSet(
      trackingUUID,
      JSON.stringify({
        talkContentId,
        ...ids,
      })
    );
    return;
  };

  // trackingUUID로 값 조회
  getValueByTrackingUUID = async ({ trackingUUID }) => {
    logger.info(`TalkClickRepository.getValueByTrackingUUID Request`);
    const value = await redisGet(trackingUUID);
    return JSON.parse(value);
  };

  // resultDetailId로 클릭 정보 조회
  getClickInfoByResultDetailId = async ({ talkResultDetailId }) => {
    logger.info(`TalkClickRepository.getClickInfoByResultDetailId Request`);
    const talkClick = await TalkClickResults.findOne({
      where: { talkResultDetailId },
    });
    return talkClick;
  };

  // groupId, talkSendId로 클릭 리스트 조회
  getClickListByGroupAndSendId = async ({ groupId, talkSendId }) => {
    logger.info(`TalkClickRepository.getClickListByGroupAndSendId Request`);
    const talkClickList = await TalkClickResults.findAll({
      where: { groupId, talkSendId },
      raw: true,
    });
    return talkClickList;
  };

  // groupId, talkSendId로 클릭 건수 조회
  getClickCountByGroupAndSendId = async ({ groupId, talkSendId }) => {
    logger.info(`TalkClickRepository.getClickCountByGroupAndSendId Request`);
    const talkClickCount = await TalkClickResults.count({
      where: { groupId, talkSendId },
      group: ['talkResultDetailId'],
    });
    return talkClickCount;
  };
};
