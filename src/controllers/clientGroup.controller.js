const { logger } = require('../middlewares/logger');
const ClientGroupService = require('../services/clientGroup.service');
const { BadRequestError } = require('../exceptions/errors');

module.exports = class ClientGroupController {
  constructor() {
    this.clientGroupService = new ClientGroupService();
  }

  // ClientGroup 등록
  createClientGroup = async (req, res, next) => {
    logger.info(`ClientGroupController.createClientGroup Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const { groupId, clientId } = req.params;

    try {
      const result = await this.clientGroupService.createClientGroup({
        userId,
        companyId,
        groupId,
        clientId,
      });

      if (!result.groupId) {
        return res.status(200).json({
          message: '그룹 해제가 완료되었습니다.',
        });
      }
      return res.status(201).json({
        groupId: result.groupId,
        message: '그룹 추가가 완료되었습니다.',
      });
    } catch (error) {
      next(error);
    }
  };

  // ClientGroup 대량등록 / 해제
  createClientGroupBulk = async (req, res, next) => {
    logger.info(`ClientGroupController.createClientGroupBulk Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const { groupId } = req.params;
    const { clientIds } = req.body;

    try {
      const result = {};
      for (const clientId of clientIds) {
        const newGroup = await this.clientGroupService.createClientGroupBulk({
          userId,
          companyId,
          groupId,
          clientId,
        });
        result.groupId = newGroup.groupId;
      }
      return res.status(201).json({
        groupId: parseInt(result.groupId),
        message: '그룹 추가가 완료되었습니다.',
      });
    } catch (error) {
      next(error);
    }
  };

  // ClientGroup 클라이언트 이동
  moveClientGroup = async (req, res, next) => {
    logger.info(`ClientGroupController.moveClientGroup Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const { clientId, existGroupId, newGroupId } = req.params;

    try {
      await this.clientGroupService.moveClientGroup({
        userId,
        companyId,
        clientId,
        existGroupId,
        newGroupId,
      });

      return res.status(201).json({
        message: '클라이언트 이동이 완료되었습니다.',
      });
    } catch (error) {
      next(error);
    }
  };

  // ClientGroup 복사
  copyClientGroup = async (req, res, next) => {
    logger.info(`ClientGroupController.copyClientGroup Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const { clientId, existGroupId, newGroupId } = req.params;

    try {
      await this.clientGroupService.copyClientGroup({
        userId,
        companyId,
        clientId,
        existGroupId,
        newGroupId,
      });

      return res.status(201).json({
        message: '클라이언트 복사가 완료되었습니다.',
      });
    } catch (error) {
      next(error);
    }
  };

  // 신규 그룹에 ClientGroup 대량 등록
  createNewClientGroupBulk = async (req, res, next) => {
    logger.info(`ClientGroupController.createNewClientGroupBulk Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const { clientIds, groupName, groupDescription } = req.body;

    try {
      if (
        !(clientIds && groupName && userId && companyId) ||
        clientIds.length < 1
      ) {
        throw new BadRequestError('입력 값을 확인해주세요.');
      }

      const result = await this.clientGroupService.createNewClientGroupBulk({
        userId,
        companyId,
        clientIds,
        groupName,
        groupDescription,
      });

      return res.status(201).json({
        groupId: result.groupId,
        message: '신규 그룹에 클라이언트 추가가 완료되었습니다.',
      });
    } catch (error) {
      next(error);
    }
  };
};
