const { logger } = require('../../middlewares/logger');

module.exports = class ClientGroupRepository {
  constructor() {}
  // 클라이언트 그룹 생성
  createClientGroup = async () => {
    logger.info(`ClientGroupRepository.createClientGroup Request`);

    return;
  };
};
