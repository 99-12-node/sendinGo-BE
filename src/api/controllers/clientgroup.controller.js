const { logger } = require('../../middlewares/logger');
const ClientGroupService = require('../services/clientgroup.service');

module.exports = class clientGroupController {
  constructor() {
    this.clientGroupService = new ClientGroupService();
  }

  // 클라이언트 그룹 생성
  createClientGroup = async (req, res, next) => {
    //const {userId} = res.locals.users;
    const { clientId, groupName, gruopDescription } = req.body;

    try {
      await this.clientGroupService.createClientGroup({
        //userId
        clientId,
        groupName,
        gruopDescription,
      });
      res.status(201).json({ message: '그룹 생성이 완료되었습니다.' });
    } catch (error) {
      next(error);
    }
  };

  //그룹 전체 조회
  getAllGroup = async (req, res, next) => {
    logger.info(`clientGroupController.getAllGroup Request`);
    const { groupId, groupName, createdAt } = req.body;
    try {
      const allGroupData = await this.clientGroupService.getAllGroup({
        groupId,
        groupName,
        createdAt,
      });
      res.status(200)({ data: allGroupData });
    } catch (error) {
      next(error);
    }
  };

  //그룹 삭제
};
