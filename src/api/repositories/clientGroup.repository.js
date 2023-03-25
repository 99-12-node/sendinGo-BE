const { logger } = require('../../middlewares/logger');
const { ClientGroups } = require('../../db/models');
const { Op } = require('sequelize');
const { NotFoundError } = require('../../exceptions/errors');

module.exports = class ClientGroupRepository {
  constructor() {}

  // ClientGroup 생성
  createClientGroup = async ({ groupId, clientId }) => {
    logger.info(`ClientGroupRepository.createClientGroup Request`);
    const clientGroupData = await ClientGroups.create({
      groupId,
      clientId,
    });
    return clientGroupData;
  };

  //ClientGroup 삭제
  deleteClientGroup = async ({ groupId, clientId }) => {
    logger.info(`ClientGroupRepository.deleteClientGroup Request`);
    const deletedClientGroup = await ClientGroups.destroy({
      where: {
        [Op.and]: [{ groupId }, { clientId }],
      },
    });
    return deletedClientGroup;
  };

  //ClientGroup Id로 조회
  getClientGroupById = async ({ groupId, clientId }) => {
    logger.info(`ClientGroupRepository.getClientGroupById Request`);
    const clientGroup = await ClientGroups.findOne({
      where: {
        [Op.and]: [{ groupId }, { clientId }],
      },
    });

    return clientGroup;
  };
};
