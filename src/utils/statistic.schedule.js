const schedule = require('node-schedule');
const StatisticsService = require('../services/statistics.service');
const statisticsService = new StatisticsService();

const { logger } = require('../middlewares/logger');
require('dotenv').config();
const { KEY } = process.env;

module.exports = async (req, res, next) => {
  const { userId } = res.locals.user;
  const { companyId } = res.locals.company;

  try {
    logger.info(`utils createStatistics`);
    const HOURLYRULE = '0 0 * * * *'; // 주기 : 매시 정각
    const DAILYRULE = '0 0 0 * * *'; // 주기 : 매일 0시
    // 시간 단위
    const hourlyStatisticsJob = schedule.scheduleJob(HOURLYRULE, async () => {
      logger.info(`> hour / scheduledJobs : ${hourlyStatisticsJob.name}`);
      await statisticsService.createHourlyStatistics({ userId, companyId });
    });
    // 일 단위
    const dailyStatisticsJob = schedule.scheduleJob(DAILYRULE, async () => {
      logger.info(`> daily / scheduledJobs : ${dailyStatisticsJob.name}`);
      await statisticsService.createDailyStatistics({ userId, companyId });
    });

    // 주 단위 TO DO
    // const weeklytatisticsJob = schedule.scheduleJob(DAILYRULE, async () => {
    //   await statisticsService.createHourlyStatistics({ userId, companyId });
    // });
    next();
  } catch (error) {
    next(error);
  }
};
