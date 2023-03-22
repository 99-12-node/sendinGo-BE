const { logger } = require('../../middlewares/logger');
const { BadRequestError, NotFoundError } = require('../../exceptions/errors');
const ClientGroupRepository = require('../repositories/clientGroup.repository');
const GroupRepository = require('../repositories/group.repository');
const ClientReposiory = require('../repositories/client.repository');

module.exports = class ClientGroupService {
  constructor() {
    this.clientGroupRepository = new ClientGroupRepository();
    this.groupRepository = new GroupRepository();
    this.clientRepository = new ClientReposiory();
  }
  // ClientGroup 등록
  createClientGroup = async ({ groupId, clientId }) => {
    logger.info(`ClientGrouopService.createClientGroup Request`);

    // 존재하는 groupId 인지 확인
    const existGroup = await this.groupRepository.findGroupId({ groupId });
    if (!existGroup) {
      throw new NotFoundError('그룹 조회에 실패했습니다.');
    }

    // 존재하는 clientId 인지 확인
    const existClient = await this.clientRepository.getClientById({ clientId });
    if (!existClient) {
      throw new NotFoundError('클라이언트 조회에 실패했습니다.');
    }

    // 기존 등록 여부 확인
    const existClientGroup =
      await this.clientGroupRepository.getClientGroupById({
        groupId,
        clientId,
      });

    // 등록된 경우, 해제
    if (existClientGroup) {
      const destoryResult = await this.clientGroupRepository.deleteClientGroup({
        groupId,
        clientId,
      });
      return destoryResult;
    } else {
      // 등록되지 않은 경우, 추가
      const clientGroupData =
        await this.clientGroupRepository.createClientGroup({
          groupId,
          clientId,
        });
      return clientGroupData;
    }
  };

  // ClientGroup 대량등록
  createClientGroupBulk = async ({ groupId, clientIds }) => {
    logger.info(`ClientGrouopService.createClientGroupBulk Request`);

    // 존재하는 groupId 인지 확인
    const existGroup = await this.groupRepository.findGroupId({ groupId });
    if (!existGroup) {
      throw new NotFoundError('그룹 조회에 실패했습니다.');
    }

    let result;
    for (const clientId of clientIds) {
      // clientId 존재여부 확인
      const existClient = await this.clientRepository.getClientById({
        clientId,
      });
      if (!existClient) {
        throw new NotFoundError('클라이언트 조회에 실패했습니다.');
      }

      // 기존 등록 여부 확인
      const existClientGroup =
        await this.clientGroupRepository.getClientGroupById({
          groupId,
          clientId,
        });

      // 등록된 경우, 해제
      if (existClientGroup) {
        const destoryResult =
          await this.clientGroupRepository.deleteClientGroup({
            groupId,
            clientId,
          });

        result = { destoryResult };
      } else {
        // 등록되지 않은 경우, 추가
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

  // ClientGroup 복사
  copyClientGroup = async ({ clientId, groupId }) => {
    logger.info(`ClientGrouopService.copyClientGroup Request`);
    const existClientGroup =
      await this.clientGroupRepository.getClientGroupById({
        clientId,
        groupId,
      });
    if (existClientGroup) {
      throw new BadRequestError('이미 존재하는 그룹입니다.');
    } else {
      const newClientGroup = await this.clientGroupRepository.createClientGroup(
        { clientId, groupId }
      );
      return newClientGroup;
    }
  };

  // ClientGroup 삭제
  deleteClientGroup = async ({ groupId, clientId }) => {
    logger.info(`ClientGroupService.deleteClientGroup Request`);
    const clientGroupData = await this.clientGroupRepository.deleteClientGroup({
      groupId,
      clientId,
    });
    if (!clientGroupData) {
      throw new BadRequestError('기존 그룹에서 삭제에 실패하였습니다.”');
    }
  };
};
