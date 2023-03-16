const { logger } = require('../../middlewares/logger');
const { Groups } = require('../../db/models');

module.exports = class ClientGroupRepository {
  constructor() {}
  // 클라이언트 그룹 생성
  createClientGroup = async ({
    //userId,
    groupName,
    groupDescription,
  }) => {
    const createData = await Groups.create({
      //userId,
      groupName,
      groupDescription,
    });
    return createData;
  };

  //그룹 전체 조회
  getAllGroup = async ({ groupId, groupName, createdAt }) => {
    logger.info(`clientGroupController.getAllGroup Request`);
    const allGroupData = await Groups.findAll({
      groupId,
      groupName,
      createdAt,
    });
    return allGroupData;
  };

  //그룹 삭제
};
