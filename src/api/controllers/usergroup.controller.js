const { logger } = require('../middlewares/logger');
const UserGroupService = require('../services/usergroup.service');

module.exports = class userGroupController {
  constructor() {
    this.userGroupService = new UserGroupService();
  }

  // 유저 그룹 생성
  createUserGroup = async (req, res, next) => {
    logger.info(`userGroupController.createUserGroup Request`);

    try {
      // userGroupService 활용하기
      res.status(201).json({ message: '유저 그룹이 생성되었습니다.' });
    } catch (error) {
      next(error);
    }
  };
};
