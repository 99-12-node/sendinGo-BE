const { logger } = require('../middlewares/logger');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require('../exceptions/errors');
const GroupRepository = require('../repositories/group.repository');

module.exports = class GroupService {
  constructor() {
    this.groupRepository = new GroupRepository();
  }
  // 빈 Group 생성
  createGroup = async ({ userId, companyId, groupName, groupDescription }) => {
    logger.info(`GroupService.createGroup Request`);
    //동일 그룹명 있는지 확인
    const existGroupName = await this.groupRepository.findSameGroup({
      userId,
      companyId,
      groupName,
    });
    //동일 그룹명이 1개 이상일 때 숫자표기
    if (existGroupName.length > 0) {
      const groupData = await this.groupRepository.createGroup({
        userId,
        companyId,
        groupName: `${groupName}(${existGroupName.length})`,
        groupDescription,
      });
      if (!groupData) {
        throw new BadRequestError('그룹 생성에 실패하였습니다.');
      }
      return groupData;
    } else {
      const groupData = await this.groupRepository.createGroup({
        userId,
        companyId,
        groupName,
        groupDescription,
      });
      if (!groupData) {
        throw new BadRequestError('그룹 생성에 실패하였습니다.');
      }

      return groupData;
    }
  };

  //그룹 전체 조회
  getAllGroup = async ({ userId, companyId }) => {
    logger.info(`GroupService.getAllGroup Request`);

    const allGroupData = await this.groupRepository.getAllGroup({
      userId,
      companyId,
    });
    return allGroupData;
  };

  //그룹 삭제
  deleteGroup = async ({ userId, companyId, groupId }) => {
    logger.info(`GroupService.deleteGroup Request`);
    const findGroupData = await this.groupRepository.findGroupId({
      userId,
      companyId,
      groupId,
    });
    if (!findGroupData) {
      throw new NotFoundError('그룹 삭제에 실패하였습니다.');
    }
    if (findGroupData.groupName === '미지정') {
      throw new BadRequestError('미지정 그룹은 삭제할 수 없습니다.');
    }
    if (findGroupData.userId !== userId) {
      throw new ForbiddenError('접근 권한이 없습니다.');
    }
    const deleteGroupData = await this.groupRepository.deleteGroup({
      userId,
      companyId,
      groupId,
    });

    return deleteGroupData;
  };
};
