const schedule = require('node-schedule');

const StatisticsService = require('../services/statistics.service');
const statisticsService = new StatisticsService();

const { logger } = require('../middlewares/logger');
require('dotenv').config();

module.exports = async (req, res, next) => {
  const { userId } = res.locals.user;
  const { companyId } = res.locals.company;

  try {
    if (parseInt(process.env.INSTANCE_ID) === 0)
      logger.info(`utils createStatistics`);

    const statisticJob = `companyId:${companyId}:userId:${userId}`;
    const HOURLYRULE = '0 0 * * * *'; // 주기 : 매시 정각
    const DAILYRULE = '0 0 * * *'; // 주기 : 매일 0시
    const WEEKLYRULE = '0 0 * * 1'; // 주기 : 매주 월 0시

    if (!schedule.scheduleJobs[statisticJob]) {
      // 시간 단위 통계 생성
      const hourlyStatisticsJob = schedule.scheduleJob(HOURLYRULE, async () => {
        logger.info(`> hour / scheduledJobs : ${hourlyStatisticsJob.name}`);
        await statisticsService.createHourlyStatistics({ userId, companyId });
      });
      // 일 단위 통계 생성
      const dailyStatisticsJob = schedule.scheduleJob(DAILYRULE, async () => {
        logger.info(`> daily / scheduledJobs : ${dailyStatisticsJob.name}`);
        await statisticsService.createDailyStatistics({ userId, companyId });
      });

      // 주 단위 통계 생성
      const weeklytatisticsJob = schedule.scheduleJob(WEEKLYRULE, async () => {
        logger.info(`> weekly / scheduledJobs : ${weeklytatisticsJob.name}`);
        await statisticsService.createWeeklyStatistics({ userId, companyId });
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
