const { logger } = require('../../middlewares/logger');
const ClientService = require('../services/client.service');

module.exports = class ClientController {
  constructor() {
    this.clientService = new ClientService();
  }

  // 클라이언트 등록
  createClient = async (req, res, next) => {
    logger.info(`ClientController.createClient Request`);
    // const { userId } = res.locals.users;
    const { clientName, contact } = req.body;

    try {
      const newClient = await this.clientService.createClient({
        //userId,
        clientName,
        contact,
      });

      return res.status(201).json({
        clientId: newClient.clientId,
        message: '등록이 완료되었습니다.',
      });
    } catch (error) {
      next(error);
    }
  };

  //클라이언트 전체 조회
  getAllClient = async (req, res, next) => {
    try {
      const allData = await this.clientService.getAllClient();

      return res.status(200).json({ data: allData });
    } catch (error) {
      next(error);
    }
  };

  //클라이언트 삭제
  deleteClient = async (req, res, next) => {
    // const { userId } = res.locals.user;
    const { clientId } = req.params;
    try {
      await this.clientService.deleteClient({
        //userId,
        clientId,
      });

      return res.status(200).json({ message: '삭제가 완료되었습니다.' });
    } catch (error) {
      next(error);
    }
  };
};
