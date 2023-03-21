const { logger } = require('../../middlewares/logger');
const { ClientGroups } = require('../../db/models');

module.exports = class ClientGroupRepository {
  constructor() {}

  //ClientGroup 생성
  createClientGroup = async ({ groupId, clientId }) => {
    logger.info(`ClientGroupRepository.createClientGroup Request`);
    const clientGroupData = await ClientGroups.create({
      groupId,
      clientId,
    });
    return clientGroupData;
  };
};
