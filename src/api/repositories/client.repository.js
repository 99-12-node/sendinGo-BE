const { logger } = require('../../middlewares/logger');
const { Clients } = require('../../db/models');

module.exports = class ClientRepository {
  constructor() {}
  // 클라이언트 생성
  createClient = async ({
    //userId,
    clientName,
    contact,
  }) => {
    logger.info(`clientController.createclient Request`);
    const createData = await Clients.create({
      //userId,
      clientName,
      contact,
    });
    return createData;
  };

  //클라이언트 전체 조회
  getAllClient = async ({}) => {
    //userId
    const allData = await Clients.findAll({
      attributes: ['clientId', 'clientName', 'contact', 'createdAt'],
    });
    return allData;
  };

  //클라이언트 삭제
  deleteClient = async ({ clientId }) => {
    const deleteData = await Clients.destroy({
      where: { clientId },
    });
    return deleteData;
  };
};
