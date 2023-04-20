const StatisticsService = require('../services/statistics.service');
const statisticsService = new StatisticsService();

const { logger } = require('../middlewares/logger');

const HOURLYRULE = '0 * * * *'; // 주기 : 매시 정각
const DAILYRULE = '0 0 * * *'; // 주기 : 매일 0시
const WEEKLYRULE = '0 0 * * 1'; // 주기 : 매주 월 0시

const createHourlyStatistics = async () => {
  try {
    logger.info(`utils/createStatistics.createHourlyStatistics`);
    await statisticsService.generateHourlyStatistic();
  } catch (error) {
    next(error);
  }
};

const createDailyStatistics = async () => {
  try {
    logger.info(`utils/createStatistics.createDailyStatistics`);
    await statisticsService.generateDailyStatistic();
  } catch (error) {
    next(error);
  }
};
const createWeeklyStatistics = async () => {
  try {
    logger.info(`utils/createStatistics.createWeeklyStatistics`);
    await statisticsService.generateWeeklyStatistic();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createHourlyStatistics,
  createDailyStatistics,
  createWeeklyStatistics,
};
