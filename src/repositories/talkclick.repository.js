const { logger } = require('../middlewares/logger');
const { TalkClickResults, TalkContents } = require('../db/models');
const parseSequelizePrettier = require('../helpers/parse.sequelize');
const { Op } = require('sequelize');
const { redisSet, redisGet } = require('../db/config/redis');

const { v4: uuidv4 } = require('uuid');
//uuidv4();

module.exports = class TalkClickRepository {
  constructor() {}
  // 클릭결과 생성
  createTalkClick = async ({}) => {
    logger.info(`TalkClickRepository.createTalkClick Request`);
    const newTalkClick = await TalkClickResults.create({});
    return newTalkClick;
  };

  // 트래킹 데이터 캐싱
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
};
