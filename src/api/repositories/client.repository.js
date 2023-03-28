const { logger } = require('../../middlewares/logger');
const { Groups, Clients, ClientGroups, sequelize } = require('../../db/models');
const parseSequelizePrettier = require('../../helpers/parse.sequelize');

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
      // userId,
      clientName,
      contact,
      clientEmail,
    });
    return createData;
  };

  //클라이언트 전체 조회
  getAllClients = async ({ offset }) => {
    logger.info(`ClientRepository.getAllClients Request`);
    const allData = await Clients.findAll({
      attributes: {
        exclude: ['updatedAt'],
      },
      include: [
        {
          model: ClientGroups,
          attributes: ['groupId'],
          include: [
            {
              model: Groups,
              attributes: ['groupName'],
            },
          ],
        },
      ],
      order: [['clientName', 'ASC']],
      offset: offset * 14,
      limit: 14,
      raw: true,
    }).then((model) => model.map(parseSequelizePrettier));
    return allData;
  };

  // getClientPage = async ({ index, limit }) => {
  //   logger.info(`ClientRepository.getClientPage Request`);
  //   const page = await Clients.findAllCount({
  //     attributes: {
  //       exclude: ['updatedAt'],
  //     },
  //     include: [
  //       {
  //         model: ClientGroups,
  //         attributes: ['groupId'],
  //         include: [
  //           {
  //             model: Groups,
  //             attributes: ['groupName'],
  //           },
  //         ],
  //       },
  //     ],
  //     order: [['clientName', 'ASC']],
  //     index,
  //     limit,
  //     raw: true,
  //   });
  // };

  //클라이언트 그룹별 조회
  getClientsByGroup = async ({ groupId }) => {
    logger.info(`ClientRepository.getClientsByGroup Request`);
    const allData = await Clients.findAll({
      attributes: {
        exclude: ['updatedAt'],
      },
      include: [
        {
          model: ClientGroups,
          attributes: ['groupId'],
          where: { groupId },
          include: [
            {
              model: Groups,
              attributes: ['groupName'],
            },
          ],
        },
      ],
      order: [['clientName', 'ASC']],
      raw: true,
    }).then((model) => model.map(parseSequelizePrettier));
    return allData;
  };

  //클라이언트 수정
  editClientInfo = async ({ clientId, clientName, contact, clientEmail }) => {
    logger.info(`ClientRepository.editClientInfo Request`);
    const editClientData = await Clients.update(
      { clientName, contact, clientEmail },
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

  //클라이언트 전체 인원 조회
  getAllClientsCount = async () => {
    logger.info(`ClientRepository.getAllClientsCount Request`);
    const count = await Clients.count({});
    return count;
  };
};
