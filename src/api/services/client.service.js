const { logger } = require('../../middlewares/logger');
const {
  BadRequestError,
  Conflict,
  NotFoundError,
} = require('../../exceptions/errors');
const ClientRepository = require('../repositories/client.repository');
const GroupRepository = require('../repositories/group.repository');

module.exports = class ClientService {
  constructor() {
    this.clientRepository = new ClientRepository();
    this.groupRepository = new GroupRepository();
  }
  // 클라이언트 등록
  //유저 검증, 권한
  createClient = async ({
    //userId,
    clientName,
    contact,
    clientEmail,
  }) => {
    logger.info(`ClientService.createClient Request`);

    const createClient = await this.clientRepository.createClient({
      // userId,
      clientName,
      contact,
      clientEmail,
    });
    if (!createClient) {
      throw new BadRequestError('클라이언트 등록에 실패하였습니다.');
    }
    return createClient;
  };

  //클라이언트 조회 (쿼리로 조건 조회)
  getClients = async ({ groupId, index }) => {
    logger.info(`ClientService.getClients Request`);
    if (index == 0) {
      throw new BadRequestError('올바르지 않은 요청입니다.');
    }
    const offset = index ? parseInt(index - 1) : 0;

    if (!groupId) {
      const allData = await this.clientRepository.getAllClients({ offset });
      const clientCount = await this.clientRepository.getAllClientsCount();
      return { clients: allData, clientCount };
    }
    const existGroup = await this.groupRepository.findGroupId({ groupId });
    if (!existGroup) {
      throw new NotFoundError('그룹 조회에 실패하였습니다.');
    }
    const allData = await this.clientRepository.getClientsByGroup({
      groupId,
      offset,
    });
    return allData;
  };

  //클라이언트 수정
  editClientInfo = async ({ clientId, clientName, contact, clientEmail }) => {
    logger.info(`ClientService.editClientInfo Request`);
    const editClientData = await this.clientRepository.editClientInfo({
      clientId,
      clientName,
      contact,
      clientEmail,
    });
    if (!editClientData) {
      throw new BadRequestError('수정을 실패하였습니다.');
    }

    return editClientData;
  };

  //클라이언트 삭제
  deleteClient = async ({
    //userId,
    clientId,
  }) => {
    logger.info(`ClientService.deleteClient Request`);
    const deleteData = await this.clientRepository.deleteClient({ clientId });
    if (!deleteData) {
      throw new BadRequestError('삭제에 실패하였습니다.');
    }
    // if (deleteData.userId !== userId) {
    //   throw new Error('권한이 없습니다.');
    // }

    return deleteData;
  };

  // 클라이언트 대량등록
  createClientBulk = async ({
    //userId,
    clientArray,
  }) => {
    logger.info(`ClientService.createClientBulk Request`);
    try {
      let createClients = [];

      if (!clientArray) {
        throw new BadRequestError('입력값을 확인해주세요');
      }
      for (const client of clientArray) {
        const { clientName, contact, clientEmail } = client;
        const newClient = await this.clientRepository.createClient({
          clientName,
          contact,
          clientEmail,
        });
        if (!newClient) {
          throw new BadRequestError('클라이언트 대량 등록에 실패하였습니다.');
        }
        createClients.push(newClient.clientId);
      }
      if (!createClients) {
        throw new BadRequestError('클라이언트 대량 등록에 실패하였습니다.');
      }
      return createClients;
    } catch (e) {
      console.error(e);
    }
  };
};
