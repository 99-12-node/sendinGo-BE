const { logger } = require('../../middlewares/logger');
const { Groups } = require('../../db/models');

module.exports = class GroupRepository {
  constructor() {}
  //빈 Group 생성
  createGroup = async ({
    //userId,
    groupName,
    groupDescription,
  }) => {
    const createGroup = await Groups.create({
      // userId,
      groupName,
      groupDescription,
    });

    return createGroup;
  };

  //그룹 전체 조회
  getAllGroup = async () => {
    logger.info(`GroupRepository.getAllGroup Request`);
    const allGroupData = await Groups.findAll({
      attributes: ['groupId', 'groupName', 'createdAt'],
    });
    return allGroupData;
  };

  //그룹 삭제
  deleteGroup = async ({ groupId }) => {
    logger.info(`GroupRepository.deleteGroup Request`);
    const deleteGroupData = await Groups.destroy({ where: { groupId } });
    return deleteGroupData;
  };

  //그룹 삭제시, 삭제할 groupId 있는지 찾아보기
  findGroupId = async ({ groupId }) => {
    const findGroupData = await Groups.findOne({ where: { groupId } });
    return findGroupData;
  };
};
