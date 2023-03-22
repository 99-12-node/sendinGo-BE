const { logger } = require('../../middlewares/logger');
const { BadRequestError, NotFoundError } = require('../../exceptions/errors');

const ClientGroupRepository = require('../repositories/clientGroup.repository');
const GroupRepository = require('../repositories/group.repository');
const ClientReposiory = require('../repositories/client.repository');

module.exports = class ClientCroupService {
  constructor() {
    this.clientGroupRepository = new ClientGroupRepository();
    this.groupRepository = new GroupRepository();
    this.clientRepository = new ClientReposiory();
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

  // ClientGroup 대량등록
  createClientGroupBulk = async ({ groupId, clientIds }) => {
    logger.info(`ClientGrouopService.createClientGroupBulk Request`);

    // 존재하는 groupId, clientId 인지 확인
    const existGroup = await this.groupRepository.findGroupId({ groupId });
    if (!existGroup) {
      throw new NotFoundError('그룹 조회에 실패했습니다.');
    }

    let result;
    for (const clientId of clientIds) {
      const existClient = await this.clientRepository.getClientById({
        groupId,
        clientId,
      });
      if (!existClient) {
        throw new NotFoundError('클라이언트 조회에 실패했습니다.');
      }

      const existClientGroup =
        await this.clientGroupRepository.getClientGroupById({
          groupId,
          clientId,
        });

      if (existClientGroup) {
        const destoryResult =
          await this.clientGroupRepository.deleteClientGroup({
            groupId,
            clientId,
          });

        result = { destoryResult };
      } else {
        const clientGroupData =
          await this.clientGroupRepository.createClientGroup({
            groupId,
            clientId,
          });

        result = { groupId };
      }
    }

    return result;
  };
};
