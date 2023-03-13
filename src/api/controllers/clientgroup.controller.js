const { logger } = require('../middlewares/logger');
const ClientGroupService = require('../services/clientgroup.service');

module.exports = class clientGroupController {
  constructor() {
    this.clientGroupService = new ClientGroupService();
  }

  // 클라이언트 그룹 생성
  createClientGroup = async (req, res, next) => {
    logger.info(`clientGroupController.createclientGroup Request`);

    try {
      // clientGroupService 활용하기
      res.status(201).json({ message: '클라이언트 그룹이 생성되었습니다.' });
    } catch (error) {
      next(error);
    }
  };
};
