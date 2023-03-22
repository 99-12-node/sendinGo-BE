const { logger } = require('../../middlewares/logger');
const {
  BadRequestError,
  Conflict,
  NotFoundError,
} = require('../../exceptions/errors');
const ClientRepository = require('../repositories/client.repository');

module.exports = class ClientService {
  constructor() {
    this.clientRepository = new ClientRepository();
  }
  // 클라이언트 등록
  createClient = async ({
    //userId,
    clientName,
    contact,
    clientEmail,
  }) => {
    logger.info(`ClientService.createClient Request`);
    const createData = await this.clientRepository.createClient({
      //userId
      clientName,
      contact,
      clientEmail,
    });
    if (!createData) {
      throw new BadRequestError('클라이언트 등록에 실패하였습니다.');
    }
    return createData;
  };

  //클라이언트 전체 조회
  getAllClient = async () => {
    logger.info(`ClientService.getAllClient Request`);

    const allData = await this.clientRepository.getAllClient();

    return allData;
  };

  //클라이언트 수정
  editClientInfo = async ({ clientId, clientName, contact }) => {
    logger.info(`ClientService.editClientInfo Request`);

    const editClientData = await this.clientRepository.editClientInfo({
      clientId,
      clientName,
      contact,
    });

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
      throw new BadRequestError('클라이언트 삭제에 실패하였습니다.');
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
