const ClientService = require('../services/client.service');

module.exports = class clientController {
  constructor() {
    this.clientService = new ClientService();
  }

  // 클라이언트 등록
  createClient = async (req, res, next) => {
    const { client, phoneNumber } = req.body;

    try {
      await this.ClientService.createClient({
        user,
        phoneNumber,
      });

      return res.status(201).json({ message: '등록이 완료되었습니다.' });
    } catch (error) {
      next(error);
    }
  };

  //클라이언트 전체 조회
  checkClient = async (req, res, next) => {
    try {
      const allData = await this.clientService.checkClient();

      return res.status(200).json({ allData });
    } catch (error) {
      next(error);
    }
  };

  //클라이언트 삭제
  deleteClient = async (req, res, next) => {
    try {
      await this.clientService.deleteClient();

      return res.status(200).json({ message: '삭제가 완료되었습니다.' });
    } catch (error) {
      next(error);
    }
  };
};
