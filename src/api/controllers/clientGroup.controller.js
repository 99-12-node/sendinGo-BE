const { logger } = require('../../middlewares/logger');
const ClientGroupService = require('../services/clientGroup.service');

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
};
