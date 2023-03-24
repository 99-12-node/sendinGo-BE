const { logger } = require('../../middlewares/logger');
const { BadRequestError, NotFoundError } = require('../../exceptions/errors');
const GroupRepository = require('../repositories/group.repository');

module.exports = class GroupService {
  constructor() {
    this.groupRepository = new GroupRepository();
  }
  // 빈 Group 생성
  createGroup = async ({
    //userId,
    groupName,
    groupDescription,
  }) => {
    logger.info(`GroupService.createGroup Request`);

    const groupData = await this.groupRepository.createGroup({
      // userId,
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
    if (!allGroupData) {
      throw new BadRequestError('그룹 조회에 실패하였습니다.');
    }
    return allGroupData;
  };

  //그룹 삭제
  deleteGroup = async ({ groupId }) => {
    logger.info(`GroupService.deleteGroup Request`);
    const findGroupData = await this.groupRepository.findGroupId({ groupId });
    if (!findGroupData) {
      throw new NotFoundError('그룹 삭제에 실패하였습니다.');
    }
    const deleteGroupData = await this.groupRepository.deleteGroup({
      groupId,
    });

    return deleteGroupData;
  };
};
