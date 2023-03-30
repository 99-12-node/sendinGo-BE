const { logger } = require('../middlewares/logger');
const { Groups, Clients, ClientGroups, sequelize } = require('../db/models');
const parseSequelizePrettier = require('../helpers/parse.sequelize');

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
  getAllClients = async ({ offset }) => {
    logger.info(`ClientRepository.getAllClients Request`);

    const TOTAL_OFFSET = offset * OFFSET_CONSTANT;

    const [allData] = await sequelize.query(
      `SELECT c.clientId, c.clientName, c.contact, c.clientEmail, c.createdAt, cg.groupId, g.groupName\
      FROM Clients AS c\
      LEFT OUTER JOIN ClientGroups cg ON c.clientId = cg.clientId\
      LEFT OUTER JOIN \`Groups\` g ON g.groupId = cg.groupId\
      GROUP BY c.clientId\
      ORDER BY c.createdAt DESC\
      LIMIT ${OFFSET_CONSTANT} OFFSET ${TOTAL_OFFSET}\
      `
    );
    return allData;
  };

  //클라이언트 그룹별 조회
  getClientsByGroup = async ({ groupId, offset }) => {
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
      { where: { userId, companyId, clientId } }
    );

    return editClientData;
  };

  //클라이언트 삭제
  deleteClient = async ({ clientId, userId, companyId }) => {
    logger.info(`ClientRepository.deleteClient Request`);
    const deleteData = await Clients.destroy({
      where: { clientId, userId, companyId },
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

  comfirmUser = async ({ clientId, userId, companyId }) => {
    logger.info(`ClientRepository.comfirmUser Request`);
    const client = await Clients.findOne({
      where: { clientId, userId, companyId },
    });
    return client;
  };

  comfirmUserId = async ({ userId, companyId }) => {
    logger.info(`ClientRepository. comfirmUserId Request`);
    const client = await Clients.findOne({
      where: { userId, companyId },
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
