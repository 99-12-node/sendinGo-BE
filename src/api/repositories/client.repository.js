const { Client } = require('../../db/models');

module.exports = class ClientRepository {
  constructor() {}
  // 클라이언트 생성
  createClient = async (client, phoneNumber) => {
    const createData = await User.createClient({
      client,
      phoneNumber,
    });
    return createData;
  };

  //클라이언트 전체 조회
  checkClient = async () => {
    const allData = await Client.findAll({});
    return allData;
  };

  //클라이언트 삭제
  deleteClient = async () => {
    const deleteData = await Client.destroy({});
    return deleteData;
  };
};
