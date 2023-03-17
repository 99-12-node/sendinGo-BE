const { logger } = require('../../middlewares/logger');
const { BadRequestError } = require('../../exceptions/errors');
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
  }) => {
    logger.info(`ClientService.createClient Request`);
    const createData = await this.clientRepository.createClient({
      //userId
      clientName,
      contact,
    });
    if (!createData) {
      throw new BadRequestError('클라이언트 등록에 실패하였습니다.');
    }
    return createData;
  };

  //클라이언트 전체 조회
  getAllClient = async () => {
    const allData = await this.clientRepository.getAllClient();

    return allData;
  };

  //클라이언트 삭제
  deleteClient = async ({
    //userId,
    clientId,
  }) => {
    const deleteData = await this.clientRepository.deleteClient({ clientId });
    if (!deleteData) {
      throw new BadRequestError('클라이언트 삭제에 실패하였습니다.');
    }
    // if (deleteData.userId !== userId) {
    //   throw new Error('권한이 없습니다.');
    // }

    return deleteData;
  };
};
