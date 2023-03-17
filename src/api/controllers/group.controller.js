const { logger } = require('../../middlewares/logger');
const GroupService = require('../services/group.service');

module.exports = class GroupController {
  constructor() {
    this.groupService = new GroupService();
  }

  // 클라이언트 그룹 생성
  createGroup = async (req, res, next) => {
    //const {userId} = res.locals.users;
    const { clientId, groupName, gruopDescription } = req.body;

    try {
      await this.groupService.createGroup({
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
    logger.info(`GroupController.getAllGroup Request`);

    try {
      const allGroupData = await this.groupService.getAllGroup();
      res.status(200).json({ data: allGroupData });
    } catch (error) {
      next(error);
    }
  };

  //그룹 삭제
};
