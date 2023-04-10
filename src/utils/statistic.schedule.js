const schedule = require('node-schedule');
const jwt = require('jsonwebtoken');
const { Users, Companies } = require('../db/models');
const { UnauthorizedError } = require('../exceptions/errors');
const StatisticsService = require('../services/statistics.service');
const { logger } = require('../middlewares/logger');
require('dotenv').config();
const { KEY } = process.env;
const statisticsService = new StatisticsService();

module.exports = async (req, res, next) => {
  logger.info(`daily.statistic.middleware Request`);
  const { authorization } = req.headers;
  const [tokenType, token] = (authorization ?? '').split(' ');

  try {
    if (!(tokenType && token)) {
      next();
    }
    logger.info(`auth.TokenDecoded`);
    const decodedToken = jwt.verify(token, KEY);
    const { userId, companyId } = decodedToken;
    const company = await Companies.findOne({ where: { companyId } });
    const user = await Users.findOne({ where: { userId } });

    if (!(user && company)) {
      throw new UnauthorizedError(
        '토큰에 해당하는 사용자 또는 소속이 존재하지 않습니다.'
      );
    }

    logger.info(`createStatistics`);

    const HOURLYRULE = '0 0 * * * *'; // 주기 : 매시 정각
    const DAILYRULE = '0 0 0 * * *'; // 주기 : 매일 0시
    // 시간 단위
    const hourlyStatisticsJob = schedule.scheduleJob(HOURLYRULE, async () => {
      await statisticsService.createHourlyStatistics({ userId, companyId });
    });
    // 일 단위
    const dailyStatisticsJob = schedule.scheduleJob(DAILYRULE, async () => {
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
