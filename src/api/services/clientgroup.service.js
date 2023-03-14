const { logger } = require('../../middlewares/logger');
const ClientGroupRepository = require('../repositories/clientgroup.repository');

module.exports = class ClientGroupService {
  constructor() {
    this.clientGroupRepository = new ClientGroupRepository();
  }
  // 클라이언트 그룹 생성
  createClientGroup = async () => {
    logger.info(`clientGroupService.createClientGroup Request`);
  };
};
