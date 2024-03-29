const { logger } = require('../middlewares/logger');
const ClientService = require('../services/client.service');
const AlimtalkSendService = require('../services/alimtalkSend.service');
const { BadRequestError } = require('../exceptions/errors');

module.exports = class ClientController {
  constructor() {
    this.clientService = new ClientService();
    this.alimtalkSendService = new AlimtalkSendService();
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

  //클라이언트 전체 조회 (쿼리로 조건 조회)
  getClients = async (req, res, next) => {
    logger.info(`ClientController.getClients Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const { index, keyword } = req.query;
    try {
      const allData = await this.clientService.getClients({
        userId,
        companyId,
        index,
        keyword,
      });

      return res.status(200).json({ data: allData });
    } catch (error) {
      next(error);
    }
  };

  //클라이언트 그룹별 조회 (쿼리로 조건 조회)
  getClientsByGroup = async (req, res, next) => {
    logger.info(`ClientController.getClientsByGroup Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const { groupId } = req.params;
    const { index, keyword } = req.query;
    try {
      // 파라미터로 그룹별 검색 및 페이지네이션 인덱스 가져오기
      const allData = await this.clientService.getClientsByGroup({
        userId,
        companyId,
        groupId,
        index,
        keyword,
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
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const datas = req.body.data;

    const result = [];
    try {
      for (const data of datas) {
        const { clientName, contact, clientEmail, ...talkContentData } = data;
        if (
          !(clientName && contact && clientEmail) ||
          Object.values(data).length === 0
        ) {
          throw new BadRequestError('입력 값을 확인해주세요.');
        }

        const newClients = await this.clientService.createClientBulk({
          userId,
          companyId,
          clientName,
          contact,
          clientEmail,
          ...talkContentData,
        });
        if (!newClients) {
          throw new BadRequestError('클라이언트 대량 등록에 실패하였습니다.');
        }
        result.push(newClients.clientId);
      }

      return res.status(201).json({
        clientIds: result,
        message: '대량 등록이 완료되었습니다.',
      });
    } catch (error) {
      next(error);
    }
  };
};
