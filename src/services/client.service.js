const { logger } = require('../middlewares/logger');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require('../exceptions/errors');
const ClientRepository = require('../repositories/client.repository');
const GroupRepository = require('../repositories/group.repository');
const { forbidden } = require('joi');

module.exports = class ClientService {
  constructor() {
    this.clientRepository = new ClientRepository();
    this.groupRepository = new GroupRepository();
  }
  // 클라이언트 등록
  createClient = async ({
    userId,
    companyId,
    clientName,
    contact,
    clientEmail,
  }) => {
    logger.info(`ClientService.createClient Request`);

    const createClient = await this.clientRepository.createClient({
      userId,
      companyId,
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
  getClients = async ({ userId, companyId, groupId, index }) => {
    logger.info(`ClientService.getClients Request`);

    if (index == 0) {
      throw new BadRequestError('올바르지 않은 요청입니다.');
    }
    const data = await this.clientRepository.comfirmUserId({
      userId,
      companyId,
    });
    const offset = index ? parseInt(index - 1) : 0;

    if (!groupId) {
      const allData = await this.clientRepository.getAllClients({
        userId,
        companyId,
        offset,
      });
      const clientCount = await this.clientRepository.getAllClientsCount({
        userId,
        companyId,
      });
      return { clients: allData, clientCount };
    }
    const existGroup = await this.groupRepository.findGroupId({
      userId,
      companyId,
      groupId,
    });
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
  editClientInfo = async ({
    userId,
    companyId,
    clientId,
    clientName,
    contact,
    clientEmail,
  }) => {
    logger.info(`ClientService.editClientInfo Request`);
    const data = await this.clientRepository.comfirmUser({
      userId,
      companyId,
      clientId,
    });

    if (!data) {
      throw new NotFoundError('클라이언트 조회에 실패하였습니다.');
    }

    if (userId !== data.userId) {
      throw new ForbiddenError('수정 권한이 없습니다.');
    }

    const editedClient = await this.clientRepository.editClientInfo({
      clientId,
      userId,
      companyId,
      clientName,
      contact,
      clientEmail,
    });

    if (!editedClient) {
      throw new NotFoundError('수정에 실패하였습니다');
    }

    return editedClient;
  };

  //클라이언트 삭제
  deleteClient = async ({ userId, companyId, clientId }) => {
    logger.info(`ClientService.deleteClient Request`);
    const deleteData = await this.clientRepository.comfirmUser({
      clientId,
      userId,
      companyId,
    });

    if (!deleteData) {
      throw new NotFoundError('클라이언트 조회에 실패하였습니다.');
    }

    if (userId !== deleteData.userId) {
      throw new ForbiddenError('삭제 권한이 없습니다.');
    }

    const deleteId = await this.clientRepository.deleteClient({
      clientId,
      userId,
      companyId,
    });
    if (!deleteId) {
      throw new BadRequestError('삭제에 실패하였습니다.');
    }

    return deleteData;
  };

  // 클라이언트 대량등록
  createClientBulk = async ({ userId, companyId, clientArray }) => {
    logger.info(`ClientService.createClientBulk Request`);
    try {
      let createClients = [];

      if (!clientArray) {
        throw new BadRequestError('입력값을 확인해주세요');
      }
      for (const client of clientArray) {
        const { clientName, contact, clientEmail } = client;
        const newClient = await this.clientRepository.createClient({
          userId,
          companyId,
          clientName,
          contact,
          clientEmail,
        });
        if (!newClient) {
          throw new BadRequestError('클라이언트 대량 등록에 실패하였습니다.');
        }
        console.log('newClient: ', newClient);
        createClients.push(newClient.clientId);
      }
      if (!createClients.length || createClients) {
        throw new BadRequestError('클라이언트 대량 등록에 실패하였습니다.');
      }
      return createClients;
    } catch (e) {
      console.error(e);
    }
  };
};
