const { logger } = require('../../middlewares/logger');
const { BadRequestError, NotFoundError } = require('../../exceptions/errors');
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
  //그룹아이디 요청받아서 리포지 그룹아이디 불러봤는데
  //없는 아이디라면 조회에 실패했다는 에러 메시지 반환
  deleteGroup = async ({ groupId }) => {
    logger.info(`GroupService.deleteGroup Request`);
    const findGroupData = await this.groupRepository.findGroupId({ groupId });
    if (!findGroupData) {
      throw new NotFoundError('그룹 조회에 실패하였습니다.');
    }
    const deleteGroupData = await this.groupRepository.deleteGroup({
      groupId,
    });

    return deleteGroupData;
  };
};
