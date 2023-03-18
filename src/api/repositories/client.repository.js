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
    logger.info(`ClientRepository.createClient Request`);
    const createData = await Clients.create({
      //userId,
      clientName,
      contact,
    });
    return createData;
  };

  //클라이언트 전체 조회
  getAllClient = async () => {
    const allData = await Clients.findAll({
      attributes: ['clientId', 'clientName', 'contact', 'createdAt'],
    });
    return allData;
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

  //클라이언트 수정시 동일한 번호있는지 확인
  findOneContact = async ({ contact }) => {
    const existContact = await Clients.findOne({
      where: {
        contact,
      },
    });
    return existContact;
  };

  //클라이언트 삭제
  deleteClient = async ({ clientId }) => {
    const deleteData = await Clients.destroy({
      where: { clientId },
    });
    return deleteData;
  };
};
