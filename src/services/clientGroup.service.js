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
  createClientGroup = async ({ userId, companyId, groupId, clientId }) => {
    logger.info(`ClientGrouopService.createClientGroup Request`);

    // 유저 확인
    const confirmClientId = await this.clientRepository.confirmUser({
      userId,
      companyId,
      clientId,
    });
    if (!confirmClientId) {
      throw new NotFoundError('존재하지 않는 고객입니다.');
    }

    //if (groupId === 0)
    if ({ groupId: 0 }) {
      const defaultGroup = await this.groupRepository.findDefaultGroup({
        userId,
        companyId,
      });

      defaultGroup.groupId = groupId;
    }

    // 존재하는 groupId 인지 확인
    const existGroup = await this.groupRepository.findGroupId({
      userId,
      companyId,
      groupId,
    });

    if (existGroup === null) {
      throw new NotFoundError('존재하지 않는 그룹입니다.');
    }
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

    // 등록된 경우, 해제
    if (existClientGroup) {
      const destoryResult = await this.clientGroupRepository.deleteClientGroup({
        userId,
        companyId,
        groupId,
        clientId,
      });
      return destoryResult;
    } else {
      // 등록되지 않은 경우, 추가
      const clientGroupData =
        await this.clientGroupRepository.createClientGroup({
          userId,
          companyId,
          groupId,
          clientId,
        });
      return clientGroupData;
    }
  };

  // ClientGroup 대량등록
  createClientGroupBulk = async ({ userId, companyId, groupId, clientIds }) => {
    logger.info(`ClientGrouopService.createClientGroupBulk Request`);

    // 존재하는 groupId 인지 확인
    const existGroup = await this.groupRepository.findGroupId({
      userId,
      companyId,
      groupId,
    });
    if (!existGroup) {
      throw new NotFoundError('그룹 조회에 실패했습니다.');
    }

    const result = {};
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

      // 기존 등록 여부 확인
      const existClientGroup =
        await this.clientGroupRepository.getClientGroupById({
          userId,
          companyId,
          groupId,
          clientId,
        });

      // 등록된 경우, 해제
      if (existClientGroup) {
        const destoryResult =
          await this.clientGroupRepository.deleteClientGroup({
            userId,
            companyId,
            groupId,
            clientId,
          });

        result.destoryResult = destoryResult;
      } else {
        // 등록되지 않은 경우, 추가
        const clientGroupData =
          await this.clientGroupRepository.createClientGroup({
            userId,
            companyId,
            groupId,
            clientId,
          });

        result.groupId = groupId;
      }
    }

    return result;
  };

  // ClientGroup 클라이언트 이동
  moveClientGroup = async ({
    userId,
    companyId,
    clientId,
    existGroupId,
    newGroupId,
  }) => {
    logger.info(`ClientGrouopService.moveClientGroup Request`);
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
    logger.info(`ClientGrouopService.createNewClientGroupBulk Request`);

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
