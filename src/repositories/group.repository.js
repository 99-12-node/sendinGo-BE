const { logger } = require('../middlewares/logger');
const { Groups, ClientGroups, sequelize } = require('../db/models');
const { Op } = require('sequelize');

module.exports = class GroupRepository {
  constructor() {}

  //빈 Group 생성
  createGroup = async ({ userId, companyId, groupName, groupDescription }) => {
    logger.info(`GroupRepository.createGroup Request`);
    const createGroup = await Groups.create({
      userId,
      companyId,
      groupName,
      groupDescription,
    });

    return createGroup;
  };

  //그룹 전체 조회
  getAllGroup = async ({ userId, companyId }) => {
    logger.info(`GroupRepository.getAllGroup Request`);
    const allGroupData = await Groups.findAll({
      where: { [Op.and]: [{ userId }, { companyId }] },
      attributes: [
        'groupId',
        'groupName',
        'groupDescription',
        'createdAt',
        [sequelize.fn('COUNT', sequelize.col('clientId')), 'clientCount'],
      ],
      include: [
        {
          model: ClientGroups,
          attributes: [],
        },
      ],
      group: ['Groups.groupId'],
      order: [['createdAt', 'DESC']],
    });
    return allGroupData;
  };

  //그룹 삭제
  deleteGroup = async ({ userId, companyId, groupId }) => {
    logger.info(`GroupRepository.deleteGroup Request`);
    const deleteGroupData = await Groups.destroy({
      where: { [Op.and]: [{ userId }, { companyId }, { groupId }] },
    });
    return deleteGroupData;
  };

  //그룹 삭제시, 삭제할 groupId 있는지 찾아보기
  findGroupId = async ({ userId, companyId, groupId }) => {
    logger.info(`GroupRepository.findGroupId Request`);
    const findGroupData = await Groups.findOne({
      where: { [Op.and]: [{ userId }, { companyId }, { groupId }] },
    });
    return findGroupData;
  };
};
