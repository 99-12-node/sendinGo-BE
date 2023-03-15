const { logger } = require('../../middlewares/logger');
const ClientGroupService = require('../services/clientgroup.service');

module.exports = class clientGroupController {
  constructor() {
    this.clientGroupService = new ClientGroupService();
  }

  // 클라이언트 그룹 생성
  createClientGroup = async (req, res, next) => {
    logger.info(`clientGroupController.createclientGroup Request`);
    //const {userId} = res.locals.users;
    const { groupName, gruopDescription } = req.body;

    try {
      await this.clientGroupService.createClientGroup({
        groupName,
        gruopDescription,
      });
      res.status(201).json({ message: '그룹 생성이 완료되었습니다.' });
    } catch (error) {
      next(error);
    }
  };
};
