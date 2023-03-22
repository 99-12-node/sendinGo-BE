const { logger } = require('../../middlewares/logger');
const { ClientGroups } = require('../../db/models');
const { Op } = require('sequelize');

module.exports = class ClientGroupRepository {
  constructor() {}

  // clientId 찾기
  findClientId = async ({ clientId }) => {
    logger.info(`ClientGroupRepository.findClientId Request`);
    const clientIdData = await ClientGroups.findByPk(clientId);

    return clientIdData;
  };

  //해당하는 clientId찾고 ClientGroup 삭제
  //clientId와 동일한 ClientGroup 전부 삭제됨.
  //삭제는 ClientGroup이 삭제되야 하는데
  //기능은 한개씩 나누기, 트랜잭션 사용하면 좋지만

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
