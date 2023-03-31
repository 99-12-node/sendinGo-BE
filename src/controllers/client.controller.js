const { logger } = require('../middlewares/logger');
const ClientService = require('../services/client.service');
const { BadRequestError } = require('../exceptions/errors');

module.exports = class ClientController {
  constructor() {
    this.clientService = new ClientService();
  }

  // 클라이언트 등록
  createClient = async (req, res, next) => {
    logger.info(`ClientController.createClient Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const { clientName, contact, clientEmail } = req.body;

    try {
      const newClient = await this.clientService.createClient({
        userId,
        companyId,
        clientName,
        contact,
        clientEmail,
      });

      return res.status(201).json({
        clientId: newClient.clientId,
        message: '등록이 완료되었습니다.',
      });
    } catch (error) {
      next(error);
    }
  };

  //클라이언트 조회 (쿼리로 조건 조회)
  getClients = async (req, res, next) => {
    logger.info(`ClientController.getClients Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const { groupId, index } = req.query;
    try {
      const allData = await this.clientService.getClients({
        userId,
        companyId,
        groupId,
        index,
      });

      return res.status(200).json({ data: allData });
    } catch (error) {
      next(error);
    }
  };
  //클라이언트 수정
  editClientInfo = async (req, res, next) => {
    logger.info(`ClientController.editClientInfo Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const { clientId } = req.params;
    const { clientName, contact, clientEmail } = req.body;

    try {
      const editClientData = await this.clientService.editClientInfo({
        clientId,
        userId,
        companyId,
        clientName,
        contact,
        clientEmail,
      });

      return res.status(200).json({ message: '수정이 완료되었습니다.' });
    } catch (error) {
      next(error);
    }
  };

  //클라이언트 삭제
  deleteClient = async (req, res, next) => {
    logger.info(`ClientController.deleteClient Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const { clientId } = req.params;
    try {
      await this.clientService.deleteClient({
        userId,
        companyId,
        clientId,
      });

      return res.status(200).json({ message: '삭제가 완료되었습니다.' });
    } catch (error) {
      next(error);
    }
  };

  // 클라이언트 대량등록
  createClientBulk = async (req, res, next) => {
    logger.info(`ClientController.createClientBulk Request`);
    try {
      const { userId } = res.locals.user;
      const { companyId } = res.locals.company;
      const { data } = req.body;
      if (!data || Object.keys(data).length === 0) {
        throw new BadRequestError('입력 값을 확인해주세요.');
      }

      const newClients = await this.clientService.createClientBulk({
        userId,
        companyId,
        clientArray: data,
      });

      return res.status(201).json({
        newClients,
        message: '대량 등록이 완료되었습니다.',
      });
    } catch (error) {
      next(error);
    }
  };

  //clientId로 등록된 클라이언트 조회
  getCreatedClientsById = async (req, res, next) => {
    logger.info(`ClientController.getCreatedClientsById Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const { groupId, clientIds } = req.body;

    try {
      if (!groupId || clientIds.length < 1) {
        throw new BadRequestError('올바르지 않은 요청입니다.');
      }

      const allClients = await this.clientService.getCreatedClientsById({
        userId,
        companyId,
        groupId,
        clientIds,
      });

      return res.status(200).json({ data: allClients });
    } catch (error) {
      next(error);
    }
  };
};
