const { logger } = require('../middlewares/logger');

module.exports = class UserGroupRepository {
  constructor() {}
  // 유저 그룹 생성
  createUserGroup = async () => {
    logger.info(`UserGroupRepository.createUserGroup Request`);

    return;
  };
};
