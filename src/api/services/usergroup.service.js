const { logger } = require('../middlewares/logger');
const UserGroupRepository = require('../repositories/usergroup.repository');

module.exports = class UserGroupService {
  constructor() {
    this.userGroupRepository = new UserGroupRepository();
  }
  // 유저 그룹 생성
  createUserGroup = async () => {
    logger.info(`UserGroupService.createUserGroup Request`);
  };
};
