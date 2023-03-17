const { logger } = require('../../middlewares/logger');
const GroupRepository = require('../repositories/groups.repository');

module.exports = class GroupService {
  constructor() {
    this.groupRepository = new GroupRepository();
  }
  // 클라이언트 그룹 생성
  createGroup = async ({
    //userId,
    clientId,
    groupName,
    groupDescription,
  }) => {
    const groupData = await this.groupRepository.createGroup({
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
    logger.info(`GroupService.getAllGroup Request`);
    const allGroupData = await this.groupRepository.getAllGroup({
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
