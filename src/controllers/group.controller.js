const { BadRequestError } = require('../exceptions/errors');
const { logger } = require('../middlewares/logger');
const GroupService = require('../services/group.service');

module.exports = class GroupController {
  constructor() {
    this.groupService = new GroupService();
  }

  //빈 Group 생성
  createGroup = async (req, res, next) => {
    logger.info(`GroupController.createGroup Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const { groupName, groupDescription } = req.body;

    try {
      const groupData = await this.groupService.createGroup({
        userId,
        companyId,
        groupName,
        groupDescription,
      });
      res.status(201).json({
        groupId: groupData.groupId,
        message: '그룹 생성이 완료되었습니다.',
      });
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
  deleteGroup = async (req, res, next) => {
    logger.info(`GroupController.deleteGroup Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const { groupId } = req.params;

    try {
      await this.groupService.deleteGroup({ userId, companyId, groupId });
      res.status(200).json({ message: '그룹 삭제가 완료되었습니다.' });
    } catch (error) {
      next(error);
    }
  };
};
