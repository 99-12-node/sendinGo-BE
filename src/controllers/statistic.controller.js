const { BadRequestError } = require('../exceptions/errors');
const { logger } = require('../middlewares/logger');
const StatisticsService = require('../services/statistics.service');
const { CurrentStatisticsDto } = require('../dtos/statistic.dto');

module.exports = class StatisticController {
  constructor() {
    this.statisticService = new StatisticsService();
  }

  // 현재 통계 조회
  getCurrentStatistic = async (req, res, next) => {
    logger.info(`StatisticController.getCurrentStatistic Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;

    try {
      const statisticData = await this.statisticService.getCurrentStatistic({
        userId,
        companyId,
      });
      if (!statisticData) {
        const newStatistic = await this.statisticService.createHourlyStatistics(
          {
            userId,
            companyId,
          }
        );
        return res
          .status(200)
          .json({ data: new CurrentStatisticsDto(newStatistic) });
      }
      return res
        .status(201)
        .json({ data: new CurrentStatisticsDto(statisticData) });
    } catch (error) {
      next(error);
    }
  };
};
