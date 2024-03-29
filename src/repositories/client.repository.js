const { logger } = require('../middlewares/logger');
const { Groups, Clients, ClientGroups, sequelize } = require('../db/models');
const parseSequelizePrettier = require('../helpers/parse.sequelize');
const { Op } = require('sequelize');

// offset 기준 상수
const OFFSET_CONSTANT = 10;

module.exports = class ClientRepository {
  constructor() {}
  // 클라이언트 & 기본 그룹 생성
  createClientAndGroup = async ({
    userId,
    companyId,
    clientName,
    contact,
    clientEmail,
  }) => {
    logger.info(`ClientRepository.createClientAndGroup Request`);
    try {
      const result = await sequelize.transaction(async (t) => {
        const createClient = await Clients.create(
          {
            userId,
            companyId,
            clientName,
            contact,
            clientEmail,
          },
          { transaction: t }
        );
        const defaultGrouop = await Groups.findOne(
          {
            where: {
              [Op.and]: [
                { userId: createClient.userId },
                { companyId: createClient.companyId },
                { groupName: '미지정' },
              ],
            },
            attributes: ['groupName', 'groupId', 'userId', 'companyId'],
          },
          { transaction: t }
        );
        const defaultClientGrouop = await ClientGroups.create(
          {
            groupId: defaultGrouop.groupId,
            userId: defaultGrouop.userId,
            companyId: defaultGrouop.companyId,
            clientId: createClient.clientId,
          },
          { transaction: t }
        );
        return defaultClientGrouop;
      });
      return result;
    } catch (e) {
      console.error(e);
    }
  };

  // 클라이언트 개별 생성
  createClient = async ({
    userId,
    companyId,
    clientName,
    contact,
    clientEmail,
  }) => {
    logger.info(`ClientRepository.createClient Request`);
    const createClient = await Clients.create({
      userId,
      companyId,
      clientName,
      contact,
      clientEmail,
    });

    return createClient;
  };

  //클라이언트 키워드 검색
  findAllClientsByKeyword = async ({ userId, companyId, keyword, offset }) => {
    logger.info(`ClientRepository.findAllClientsByKeyword Request`);
    const allData = await sequelize.query(
      'SELECT c.clientId, c.clientName, c.contact, c.clientEmail, c.createdAt, cg.groupId, g.groupName \
      FROM Clients AS c \
      LEFT OUTER JOIN ClientGroups cg ON c.clientId = cg.clientId \
      LEFT OUTER JOIN `Groups` g ON g.groupId = cg.groupId \
      WHERE c.userId = :userId AND c.companyId = :companyId \
      AND ( c.clientName LIKE :keyword OR c.contact LIKE :keyword OR c.clientEmail LIKE :keyword) \
      GROUP BY c.clientId \
      ORDER BY c.createdAt DESC, c.clientId\
      LIMIT :limit\
      OFFSET :offset;',
      {
        replacements: {
          userId,
          companyId,
          keyword: `%${keyword}%`,
          limit: OFFSET_CONSTANT,
          offset: OFFSET_CONSTANT * offset,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return allData;
  };

  //클라이언트 전체 조회
  getAllClients = async ({ userId, companyId, offset }) => {
    logger.info(`ClientRepository.getAllClients Request`);
    const allData = await sequelize
      .query(
        'SELECT c.clientId, c.clientName, c.contact, c.clientEmail, c.createdAt, cg.groupId, g.groupName \
      FROM Clients AS c \
      LEFT OUTER JOIN ClientGroups cg ON c.clientId = cg.clientId \
      LEFT OUTER JOIN `Groups` g ON g.groupId = cg.groupId \
      WHERE c.userId = :userId AND c.companyId = :companyId \
      GROUP BY c.clientId \
      ORDER BY c.createdAt DESC\
      LIMIT :limit\
      OFFSET :offset;',
        {
          replacements: {
            userId,
            companyId,
            limit: OFFSET_CONSTANT,
            offset: OFFSET_CONSTANT * offset,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      )
      .then((model) => parseSequelizePrettier(model));
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

  //클라이언트 그룹별 검색
  findClientsByKeywordAndGroup = async ({
    userId,
    companyId,
    groupId,
    keyword,
    offset,
  }) => {
    logger.info(`ClientRepository.findClientsByKeywordAndGroup Request`);

    const findData = await Clients.findAll({
      where: {
        [Op.and]: [{ userId }, { companyId }],
        [Op.or]: [
          { clientName: { [Op.like]: `%${keyword}%` } },
          { contact: { [Op.like]: `%${keyword}%` } },
          { clientEmail: { [Op.like]: `%${keyword}%` } },
        ],
      },
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
              where: { groupId },
            },
          ],
        },
      ],
      order: [
        ['createdAt', 'DESC'],
        ['clientId', 'DESC'],
      ],
      offset: offset * OFFSET_CONSTANT,
      limit: OFFSET_CONSTANT,
      raw: true,
    }).then((model) => model.map(parseSequelizePrettier));

    return findData;
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

  // 이메일, 이름, 연락처로 클라이언트 중복 정보 조회
  getDuplicatedClient = async ({
    userId,
    companyId,
    clientName,
    contact,
    clientEmail,
  }) => {
    logger.info(`ClientRepository.getDuplicatedClient Request`);
    const client = await Clients.findOne({
      where: {
        [Op.and]: [
          { userId },
          { companyId },
          { clientName },
          { contact },
          { clientEmail },
        ],
      },
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

  // groupId로 등록된 클라이언트 조회
  getClientsByGroupId = async ({ userId, companyId, groupId }) => {
    logger.info(`ClientRepository.getClientsByGroupId Request`);
    const client = await Clients.findAll({
      attributes: {
        exclude: ['userId', 'companyId', 'createdAt', 'updatedAt'],
      },
      where: {
        [Op.and]: [{ userId }, { companyId }],
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
    }).then((model) => model.map(parseSequelizePrettier));
    return client;
  };
};
