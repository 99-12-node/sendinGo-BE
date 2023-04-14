const { logger } = require('../middlewares/logger');
const {
  BadRequestError,
  NotFoundError,
  Conflict,
} = require('../exceptions/errors');
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
  createClientGroup = async ({ userId, companyId, groupId, clientId }) => {
    logger.info(`ClientGroupService.createClientGroup Request`);

    // 유저 확인
    const confirmClientId = await this.clientRepository.confirmUser({
      userId,
      companyId,
      clientId,
    });
    if (!confirmClientId) {
      throw new NotFoundError('존재하지 않는 고객입니다.');
    }

    if (parseInt(groupId) === 0) {
      const defaultGroup = await this.groupRepository.findDefaultGroup({
        userId,
        companyId,
      });
      groupId = defaultGroup.groupId;
    }

    // 존재하는 groupId 인지 확인
    const existGroup = await this.groupRepository.findGroupId({
      userId,
      companyId,
      groupId,
    });

    if (existGroup === undefined) {
      throw new NotFoundError('그룹 조회에 실패했습니다.');
    }

    // 기존 등록 여부 확인
    const existClientGroup =
      await this.clientGroupRepository.getClientGroupById({
        userId,
        companyId,
        groupId,
        clientId,
      });
    if (existClientGroup) {
      throw new Conflict('이미 등록된 고객입니다.');
    }

    const clientGroupData = await this.clientGroupRepository.createClientGroup({
      userId,
      companyId,
      groupId,
      clientId,
    });
    return clientGroupData;
  };

  // ClientGroup 대량등록
  createClientGroupBulk = async ({ userId, companyId, groupId, clientId }) => {
    logger.info(`ClientGroupService.createClientGroupBulk Request`);

    // clientId 존재여부 확인
    const existClient = await this.clientRepository.getClientByClientId({
      userId,
      companyId,
      clientId,
    });
    if (!existClient) {
      throw new NotFoundError('클라이언트 조회에 실패했습니다.');
    }

    //미지정 그룹 여부 확인
    if (parseInt(groupId) === 0) {
      const defaultGroup = await this.groupRepository.findDefaultGroup({
        userId,
        companyId,
      });
      groupId = defaultGroup.groupId;
    }

    // 존재하는 groupId 인지 확인
    const existGroup = await this.groupRepository.findGroupId({
      userId,
      companyId,
      groupId,
    });
    if (!existGroup) {
      throw new NotFoundError('그룹 조회에 실패했습니다.');
    }

    // 기존 등록 여부 확인
    const existClientGroup =
      await this.clientGroupRepository.getClientGroupById({
        userId,
        companyId,
        groupId,
        clientId,
      });

    // 기존에 등록되지 않은 경우, 추가
    if (!existClientGroup) {
      const clientGroupData =
        await this.clientGroupRepository.createClientGroup({
          userId,
          companyId,
          groupId,
          clientId,
        });

      return clientGroupData;
    }
    return existClientGroup;
  };

  // ClientGroup 클라이언트 이동
  moveClientGroup = async ({
    userId,
    companyId,
    clientId,
    existGroupId,
    newGroupId,
  }) => {
    logger.info(`ClientGroupService.moveClientGroup Request`);
    const existClientGroup =
      await this.clientGroupRepository.getClientGroupById({
        userId,
        companyId,
        clientId,
        groupId: existGroupId,
      });
    if (!existClientGroup) {
      throw new NotFoundError('존재하지 않는 그룹입니다.');
    }

    const movedClientGroup =
      await this.clientGroupRepository.getClientGroupById({
        userId,
        companyId,
        clientId,
        groupId: newGroupId,
      });
    if (movedClientGroup) {
      throw new BadRequestError('이미 존재하는 그룹입니다.');
    } else {
      await this.deleteClientGroup({
        userId,
        companyId,
        clientId,
        groupId: existGroupId,
      });
      await this.createClientGroup({
        userId,
        companyId,
        clientId,
        groupId: newGroupId,
      });
    }
  };

  //ClientGroup 복사
  copyClientGroup = async ({
    userId,
    companyId,
    clientId,
    existGroupId,
    newGroupId,
  }) => {
    logger.info(`ClientGroupService.copyClientGroup Request`);

    const existClientGroup =
      await this.clientGroupRepository.getClientGroupById({
        userId,
        companyId,
        clientId,
        groupId: existGroupId,
      });
    if (!existClientGroup) {
      throw new NotFoundError('존재하지 않는 그룹입니다.');
    }
    const movedClientGroup =
      await this.clientGroupRepository.getClientGroupById({
        userId,
        companyId,
        clientId,
        groupId: newGroupId,
      });
    if (movedClientGroup) {
      throw new BadRequestError('이미 존재하는 그룹입니다.');
    } else {
      await this.createClientGroup({
        userId,
        companyId,
        clientId,
        groupId: newGroupId,
      });
    }
  };

  // ClientGroup 삭제
  deleteClientGroup = async ({ userId, companyId, groupId, clientId }) => {
    logger.info(`ClientGroupService.deleteClientGroup Request`);
    const clientGroupData = await this.clientGroupRepository.deleteClientGroup({
      userId,
      companyId,
      groupId,
      clientId,
    });
    if (!clientGroupData) {
      throw new BadRequestError('기존 그룹에서 삭제에 실패하였습니다.”');
    }
  };

  // 신규 그룹에 ClientGroup 대량등록
  createNewClientGroupBulk = async ({
    userId,
    companyId,
    clientIds,
    groupName,
    groupDescription,
  }) => {
    logger.info(`ClientGroupService.createNewClientGroupBulk Request`);

    // 신규 그룹 생성
    const newGroup = await this.groupRepository.createGroup({
      userId,
      companyId,
      groupName,
      groupDescription,
    });
    const groupId = newGroup.groupId;

    const result = [];
    for (const clientId of clientIds) {
      // clientId 존재여부 확인
      const existClient = await this.clientRepository.getClientByClientId({
        userId,
        companyId,
        clientId,
      });
      if (!existClient) {
        throw new NotFoundError('클라이언트 조회에 실패했습니다.');
      }

      // 새로운 그룹에 클라이언트 추가
      const clientGroupData =
        await this.clientGroupRepository.createClientGroup({
          userId,
          companyId,
          groupId,
          clientId,
        });

      result.groupId = groupId;
    }

    return result;
  };
};
