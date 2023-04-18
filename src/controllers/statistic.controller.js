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
      return res.status(200).json({ data: statisticData });
    } catch (error) {
      next(error);
    }
  };

  // 시간별 통계 조회
  getHourlyStatistic = async (req, res, next) => {
    logger.info(`StatisticController.getHourlyStatistic Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;

    try {
      const statisticDataList = await this.statisticService.getHourlyStatistic({
        userId,
        companyId,
      });
      return res.status(200).json({ data: statisticDataList });
    } catch (error) {
      next(error);
    }
  };

  // 일별 통계 조회
  getDailyStatistic = async (req, res, next) => {
    logger.info(`StatisticController.getDailyStatistic Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;

    try {
      const statisticDataList = await this.statisticService.getDailyStatistic({
        userId,
        companyId,
      });
      return res.status(200).json({ data: statisticDataList });
    } catch (error) {
      next(error);
    }
  };

  // 주별 통계 조회
  getWeeklyStatistic = async (req, res, next) => {
    logger.info(`StatisticController.getWeeklyStatistic Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;

    try {
      const statisticDataList = await this.statisticService.getWeeklyStatistic({
        userId,
        companyId,
      });
      return res.status(200).json({ data: statisticDataList });
    } catch (error) {
      next(error);
    }
  };

  // 시간별 통계 생성
  generateHourlyStatistic = async (req, res, next) => {
    try {
      logger.info(`StatisticController.generateHourlyStatistic Request`);
      const datas = await this.statisticService.generateHourlyStatistic();
      return res.status(200).json({ data: datas });
    } catch (error) {
      next(error);
    }
  };

  // 일별 통계 생성
  generateDailyStatistic = async (req, res, next) => {
    try {
      logger.info(`StatisticController.generateDailyStatistic Request`);
      const datas = await this.statisticService.generateDailyStatistic();
      return res.status(200).json({ data: datas });
    } catch (error) {
      next(error);
    }
  };

  // 주별 통계 생성
  generateWeeklyStatistic = async (req, res, next) => {
    try {
      logger.info(`StatisticController.generateWeeklyStatistic Request`);
      const datas = await this.statisticService.createWeeklyStatistics();
      return res.status(200).json({ data: datas });
    } catch (error) {
      next(error);
    }
  };
};
