const { logger } = require('../middlewares/logger');
const { Groups, Clients, ClientGroups, sequelize } = require('../db/models');
const parseSequelizePrettier = require('../helpers/parse.sequelize');
const { Op } = require('sequelize');

// offset 기준 상수
const OFFSET_CONSTANT = 14;

module.exports = class ClientRepository {
  constructor() {}
  // 클라이언트 생성
  createClient = async ({
    userId,
    companyId,
    clientName,
    contact,
    clientEmail,
  }) => {
    logger.info(`ClientRepository.createClient Request`);
    const createData = await Clients.create({
      userId,
      companyId,
      clientName,
      contact,
      clientEmail,
    });
    return createData;
  };

  //클라이언트 전체 조회
  getAllClients = async ({ userId, companyId, offset }) => {
    logger.info(`ClientRepository.getAllClients Request`);
    const allData = await Clients.findAll({
      where: { [Op.and]: [{ userId }, { companyId }] },
      attributes: [
        'clientId',
        'clientName',
        'contact',
        'clientEmail',
        'createdAt',
      ],
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
      group: 'clientId',
      order: [['createdAt', 'DESC']],
      offset: offset * OFFSET_CONSTANT,
      limit: OFFSET_CONSTANT,
      raw: true,
    }).then((model) => model.map(parseSequelizePrettier));

    return allData;
  };

  //클라이언트 그룹별 조회
  getClientsByGroup = async ({ userId, companyId, groupId, offset }) => {
    logger.info(`ClientRepository.getClientsByGroup Request`);
    const allData = await Clients.findAll({
      where: { [Op.and]: [{ userId }, { companyId }] },
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
              attributes: ['groupName', 'groupDescription'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      offset: offset * OFFSET_CONSTANT,
      limit: OFFSET_CONSTANT,
      raw: true,
    }).then((model) => model.map(parseSequelizePrettier));
    return allData;
  };

  //클라이언트 수정
  editClientInfo = async ({
    userId,
    companyId,
    clientId,
    clientName,
    contact,
    clientEmail,
  }) => {
    logger.info(`ClientRepository.editClientInfo Request`);
    const editClientData = await Clients.update(
      { clientName, contact, clientEmail },
      { where: { [Op.and]: [{ userId }, { companyId }, { clientId }] } }
    );

    return editClientData;
  };

  //클라이언트 삭제
  deleteClient = async ({ clientId, userId, companyId }) => {
    logger.info(`ClientRepository.deleteClient Request`);
    const deleteData = await Clients.destroy({
      where: { [Op.and]: [{ userId }, { companyId }, { clientId }] },
    });
    return deleteData;
  };

  //클라이언트 Id로 조회
  getClientByClientId = async ({ userId, companyId, clientId }) => {
    logger.info(`ClientRepository.getClientByClientId Request`);
    const client = await Clients.findOne({
      where: { [Op.and]: [{ userId }, { companyId }, { clientId }] },
      attributes: ['clientId', 'clientName', 'contact'],
    });
    return client;
  };

  confirmUser = async ({ clientId, userId, companyId }) => {
    logger.info(`ClientRepository.confirmUser Request`);
    const client = await Clients.findOne({
      where: { [Op.and]: [{ userId }, { companyId }, { clientId }] },
    });
    return client;
  };

  confirmUserId = async ({ userId, companyId }) => {
    logger.info(`ClientRepository. confirmUserId Request`);
    const client = await Clients.findOne({
      where: { [Op.and]: [{ userId }, { companyId }] },
    });
    return client;
  };

  //클라이언트 전체 인원 조회
  getAllClientsCount = async ({ userId, companyId }) => {
    logger.info(`ClientRepository.getAllClientsCount Request`);
    const count = await Clients.count({
      where: {
        [Op.and]: [{ userId }, { companyId }],
      },
    });
    return count;
  };

  // clientId, groupId로 등록된 클라이언트 조회
  getClientByClientIdAndGroupId = async ({
    userId,
    companyId,
    groupId,
    clientId,
  }) => {
    logger.info(`ClientRepository.getClientByClientIdAndGroupId Request`);
    const client = await Clients.findOne({
      attributes: {
        exclude: ['userId', 'companyId', 'createdAt', 'updatedAt'],
      },
      where: {
        [Op.and]: [{ userId }, { companyId }, { clientId }],
      },
      include: {
        model: ClientGroups,
        attributes: [],
        where: { groupId },
        include: {
          model: Groups,
          attributes: ['groupName'],
        },
      },
      raw: true,
    }).then((model) => parseSequelizePrettier(model));
    return client;
  };
};
