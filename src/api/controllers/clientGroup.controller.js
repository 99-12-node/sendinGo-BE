const { logger } = require('../../middlewares/logger');
const ClientGroupService = require('../services/clientGroup.service');
const { BadRequestError } = require('../../middlewares/error.middleware');

module.exports = class ClientGroupController {
  constructor() {
    this.clientGroupService = new ClientGroupService();
  }

  // ClientGroup 등록
  createClientGroup = async (req, res, next) => {
    logger.info(`ClientGroupController.createClientGroup Request`);
    const { groupId, clientId } = req.params;

    try {
      const newGroup = await this.clientGroupService.createClientGroup({
        groupId,
        clientId,
      });

      return res.status(201).json({
        groupId: newGroup.groupId,
        message: '등록이 완료되었습니다.',
      });
    } catch (error) {
      next(error);
    }
  };

  // ClientGroup 대량등록 / 해제
  createClientGroupBulk = async (req, res, next) => {
    logger.info(`ClientGroupController.createClientGroupBulk Request`);
    const { groupId } = req.params;
    const { clientIds } = req.body;

    try {
      if (!(groupId && clientIds) || clientIds.length < 1) {
        throw new BadRequestError('입력 값을 확인해주세요.');
      }

      const result = await this.clientGroupService.createClientGroupBulk({
        groupId,
        clientIds,
      });
      if (!result.groupId) {
        return res.status(200).json({
          message: '그룹 해제가 완료되었습니다.',
        });
      } else {
        return res.status(201).json({
          groupId: result.groupId,
          message: '그룹 추가가 완료되었습니다.',
        });
      }
    } catch (error) {
      next(error);
    }
  };
};
