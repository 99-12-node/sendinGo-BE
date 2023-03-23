const { logger } = require('../../middlewares/logger');
const { Groups, Clients, ClientGroups } = require('../../db/models');
const GroupRepository = require('./group.repository');

module.exports = class ClientRepository {
  constructor() {}
  // 클라이언트 생성
  createClient = async ({
    //userId,
    clientName,
    contact,
    clientEmail,
  }) => {
    logger.info(`ClientRepository.createClient Request`);
    const createData = await Clients.create({
      //userId,
      clientName,
      contact,
      clientEmail,
    });
    return createData;
  };

  //클라이언트 전체 조회
  getAllClient = async () => {
    logger.info(`ClientRepository.getAllClient Request`);
    const allData = await Clients.findAll({
      attributes: ['clientId', 'clientName', 'contact', 'createdAt'],
    });
    return allData;
  };

  //ClientGroup안에그룹Id있는지
  getGroupId = async ({ groupId }) => {
    logger.info(`ClientRepository.getGroupId Request`);
    const result = await ClientGroups.findOne({
      where: { groupId },
    });
    return result;
  };

  //그룹별 클라이언트 조회
  getClientByGroup = async ({ groupId }) => {
    logger.info(`ClientRepository.getClientByGroup Request`);
    const clientList = await Groups.findOne({
      where: { groupId },
      attributes: ['groupDescription'],
      include: {
        model: Clients,
        attributes: ['clientName', 'contact', 'createdAt'],
      },
    });
    return clientList;
  };

  //클라이언트 수정
  editClientInfo = async ({ clientId, clientName, contact }) => {
    logger.info(`ClientRepository.editClientInfo Request`);
    const editClientData = await Clients.update(
      { clientName, contact },
      { where: { clientId } }
    );

    return editClientData;
  };

  //클라이언트 삭제
  deleteClient = async ({ clientId }) => {
    logger.info(`ClientRepository.deleteClient Request`);
    const deleteData = await Clients.destroy({
      where: { clientId },
    });
    return deleteData;
  };

  //클라이언트 Id로 조회
  getClientById = async ({ clientId }) => {
    logger.info(`ClientRepository.getClientById Request`);
    const client = await Clients.findOne({
      where: { clientId },
      attributes: ['clientId', 'clientName', 'contact'],
    });
    return client;
  };
};
