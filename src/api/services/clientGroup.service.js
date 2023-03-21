const { logger } = require('../../middlewares/logger');
const { BadRequestError } = require('../../middlewares/error.middleware');

const ClientGroupRepository = require('../repositories/clientGroup.repository');

module.exports = class ClientCroupService {
  constructor() {
    this.clientGroupRepository = new ClientGroupRepository();
  }
  // ClientGroup 등록
  createClientGroup = async ({ groupId, clientId }) => {
    logger.info(`ClientGrouopService.createClientGroup Request`);
    const clientGroupData = await this.clientGroupRepository.createClientGroup({
      groupId,
      clientId,
    });
    if (!clientGroupData) {
      throw new BadRequestError('그룹 추가에 실패하셨습니다.');
    }

    return clientGroupData;
  };
};
