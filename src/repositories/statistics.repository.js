const {
  HourlyStatistics,
  DailyStatistics,
  Users,
  Clients,
  Groups,
  TalkSends,
  TalkClickResults,
} = require('../db/models');
const { logger } = require('../middlewares/logger');
const { Op } = require('sequelize');

class StatisticsRepository {
  constructor() {}

  // 가입 회원 조회
  getJoinUser = async ({ userId, companyId }) => {
    logger.info(`StatisticsRepository.getJoinUser Request`);
    const user = await Users.findOne({
      where: { [Op.and]: [{ userId }, { companyId }] },
    });
    return user;
  };

  // 전체 고객 수 조회
  getTotalClientsCount = async ({ userId, companyId }) => {
    logger.info(`StatisticsRepository.getTotalClientsCount Request`);
    const clientsCount = await Clients.count({
      where: {
        [Op.and]: [{ userId }, { companyId }],
      },
    });
    return clientsCount;
  };

  // 전체 그룹 수 조회
  getTotalGroupsCount = async ({ userId, companyId }) => {
    logger.info(`StatisticsRepository.getTotalGroupsCount Request`);
    const groupsCount = await Groups.count({
      where: {
        [Op.and]: [{ userId }, { companyId }],
      },
    });
    return groupsCount;
  };

  // 누적 총 발송 건수 조회
  getAccumulateSendCount = async ({ userId, companyId }) => {
    logger.info(`StatisticsRepository.getAccumulateSendCount Request`);
    const sendCount = await TalkSends.count({
      where: {
        [Op.and]: [{ userId }, { companyId }],
      },
      attributes: ['msgCount'],
    });
    return sendCount;
  };

  // 누적 발송성공 건수 조회
  getAccumulateSuccessCount = async ({ userId, companyId }) => {
    logger.info(`StatisticsRepository.getAccumulateSuccessCount Request`);
    const successCount = await TalkSends.count({
      where: {
        [Op.and]: [{ userId }, { companyId }],
      },
      attributes: ['scnt'],
    });
    return successCount;
  };

  // 누적 클릭형 발송건수 조회
  getAccumulateClickSendCount = async ({ userId, companyId }) => {
    logger.info(`StatisticsRepository.getAccumulateClickSendCount Request`);
    const clickSendCount = await TalkSends.count({
      where: {
        [Op.and]: [{ userId }, { companyId }, { talkTemplateId: 4 }],
      },
      attributes: ['msgCount'],
    });
    return clickSendCount;
  };

  // 누적 클릭 건수 조회
  getAccumulateClickSuccessCount = async ({ userId, companyId }) => {
    logger.info(`StatisticsRepository.getAccumulateClickSuccessCount Request`);
    const clickSuccessCount = await TalkClickResults.count({
      where: {
        [Op.and]: [{ userId }, { companyId }],
      },
      group: ['TalkClickResults.talkSendId'],
    });
    return clickSuccessCount;
  };

  // 시간별 통계 저장
  createHourlyStatistics = async ({ ...statisticsFields }) => {
    const newHourlyStatistics = await HourlyStatistics.create({
      ...statisticsFields,
    });
    return newHourlyStatistics;
  };

  // 일별 통계 저장
  createDaliyStatistics = async ({ ...statisticsFields }) => {
    const newDailyStatistics = await DailyStatistics.create({
      ...statisticsFields,
    });
    return newDailyStatistics;
  };
}

module.exports = StatisticsRepository;
