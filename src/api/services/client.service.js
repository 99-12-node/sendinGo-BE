const ClientRepository = require('../repositories/client.repository');

module.exports = class ClientService {
  constructor() {
    this.clientRepository = new ClientRepository();
  }
  // 클라이언트 등록
  createClient = async () => {};

  //클라이언트 전체 조회
  checkClient = async () => {};

  //클라이언트 삭제
  deleteClient = async () => {};
};
