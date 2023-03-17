const { logger } = require('../../middlewares/logger');
const { BadRequestError } = require('../../exceptions/errors');
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
      clientId,
      groupName,
      groupDescription,
    });
    if (!groupData) {
      throw new BadRequestError('그룹 생성에 실패하였습니다.');
    }
    return groupData;
  };

  //그룹 전체 조회
  getAllGroup = async () => {
    logger.info(`GroupService.getAllGroup Request`);
    const allGroupData = await this.groupRepository.getAllGroup();

    return allGroupData;
  };

  //그룹 삭제
  deleteGroup = async ({ groupId }) => {
    logger.info(`GroupService.deleteGroup Request`);
    const deleteGroupData = await this.groupRepository.deleteGroup({ groupId });

    return deleteGroupData;
  };
};
