const { logger } = require('../../middlewares/logger');
const { Op } = require('sequelize');
const { Groups, Clients } = require('../../db/models');

module.exports = class GroupRepository {
  constructor() {}
  // 클라이언트 그룹 생성
  createGroup = async ({
    //userId,
    clientId,
    groupName,
    groupDescription,
  }) => {
    const findClientId = await Clients.findOne({ clientId });
    const createData = await Groups.create({
      //userId,
      groupName,
      groupDescription,
    });
    return findClientId, createData;
  };

  //그룹 전체 조회
  getAllGroup = async ({ groupId, groupName, createdAt }) => {
    logger.info(`GroupRepository.getAllGroup Request`);
    const allGroupData = await Groups.findAll({
      attributes: ['groupId', 'groupName', 'createdAt'],
      where: {
        [Op.and]: [
          { groupId: { [Op.ne]: null } },
          { groupName: { [Op.ne]: null } },
          { createdAt: { [Op.ne]: null } },
        ],
      },
    });
    return allGroupData;
  };

  //그룹 삭제
};
