const { logger } = require('../middlewares/logger');
const { BadRequestError, NotFoundError } = require('../exceptions/errors');
const ClientGroupRepository = require('../repositories/clientGroup.repository');
const GroupRepository = require('../repositories/group.repository');
const ClientRepository = require('../repositories/client.repository');

module.exports = class ClientGroupService {
  constructor() {
    this.clientGroupRepository = new ClientGroupRepository();
    this.groupRepository = new GroupRepository();
    this.clientRepository = new ClientRepository();
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

  // ClientGroup 클라이언트 이동
  //이동하려는 곳에 이미 존재하면 에러
  moveClientGroup = async ({ clientId, existGroupId, newGroupId }) => {
    logger.info(`ClientGrouopService.moveClientGroup Request`);
    const existClientGroup =
      await this.clientGroupRepository.getClientGroupById({
        clientId,
        groupId: existGroupId,
      });
    if (!existClientGroup) {
      throw new NotFoundError('존재하지 않는 그룹입니다.');
    }

    const movedClientGroup =
      await this.clientGroupRepository.getClientGroupById({
        clientId,
        groupId: newGroupId,
      });
    if (movedClientGroup) {
      throw new BadRequestError('이미 존재하는 그룹입니다.');
    } else {
      await this.deleteClientGroup({ clientId, groupId: existGroupId });
      await this.createClientGroup({ clientId, groupId: newGroupId });
    }
  };

  //ClientGroup 복사
  copyClientGroup = async ({ clientId, existGroupId, newGroupId }) => {
    logger.info(`ClientGroupService.copyClientGroup Request`);

    const existClientGroup =
      await this.clientGroupRepository.getClientGroupById({
        clientId,
        groupId: existGroupId,
      });
    if (!existClientGroup) {
      throw new NotFoundError('그룹이 존재하지 않습니다.');
    }
    const movedClientGroup =
      await this.clientGroupRepository.getClientGroupById({
        clientId,
        groupId: newGroupId,
      });
    if (movedClientGroup) {
      throw new BadRequestError('이미 존재하는 그룹입니다.');
    } else {
      await this.createClientGroup({ clientId, groupId: newGroupId });
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

  // 신규 그룹에 ClientGroup 대량등록
  createNewClientGroupBulk = async ({
    // userId,
    clientIds,
    groupName,
    groupDescription,
  }) => {
    logger.info(`ClientGrouopService.createNewClientGroupBulk Request`);

    // 신규 그룹 생성
    const newGroup = await this.groupRepository.createGroup({
      //userId,
      groupName,
      groupDescription,
    });
    const groupId = newGroup.groupId;

    let result;
    for (const clientId of clientIds) {
      // clientId 존재여부 확인
      const existClient = await this.clientRepository.getClientById({
        clientId,
      });
      if (!existClient) {
        throw new NotFoundError('클라이언트 조회에 실패했습니다.');
      }

      // 새로운 그룹에 클라이언트 추가
      const clientGroupData =
        await this.clientGroupRepository.createClientGroup({
          groupId,
          clientId,
        });

      result = { groupId };
    }

    return result;
  };
};