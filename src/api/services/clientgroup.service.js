const { logger } = require('../../middlewares/logger');
const ClientGroupRepository = require('../repositories/clientgroups.repository');

module.exports = class ClientGroupService {
  constructor() {
    this.clientGroupRepository = new ClientGroupRepository();
  }
  // 클라이언트 그룹 생성
  createClientGroup = async ({
    //userId,
    clientId,
    groupName,
    groupDescription,
  }) => {
    const groupData = await this.clientGroupRepository.createClientGroup({
      //userId,
      clientId,
      groupName,
      groupDescription,
    });
    if (!groupData) {
      throw new Error('그룹 생성에 실패하였습니다.');
    }
    return groupData;
  };

  //그룹 전체 조회
  getAllGroup = async ({ groupId, groupName, createdAt }) => {
    logger.info(`clientGroupController.getAllGroup Request`);
    const allGroupData = await this.clientGroupRepository.getAllGroup({
      groupId,
      groupName,
      createdAt,
    });
    if (!allGroupData) {
      throw new Error('그룹 조회에 실패하였습니다.');
    }
    return allGroupData;
  };

  //그룹 삭제
};
