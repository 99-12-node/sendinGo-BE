const StatisticsRepository = require('../repositories/statistics.repository');
const { logger } = require('../middlewares/logger');
const { CurrentStatisticsDto } = require('../dtos/statistic.dto');

class StatisticsService {
  constructor() {
    this.statisticsRepository = new StatisticsRepository();
  }

  // 시간별 통계 생성
  createHourlyStatistics = async ({ userId, companyId }) => {
    logger.info(`StatisticsService.createHourlyStatistics Request`);
    try {
      // 전체 고객 수 조회
      const totalClientCount =
        await this.statisticsRepository.getTotalClientsCount({
          userId,
          companyId,
        });

      // 전체 그룹 수 조회
      const totalGroupCount =
        await this.statisticsRepository.getTotalGroupsCount({
          userId,
          companyId,
        });

      // 누적 총 발송 건수 조회
      const accumulateSendCount =
        await this.statisticsRepository.getAccumulateSendCount({
          userId,
          companyId,
        });

      // 누적 발송성공 건수 조회
      const accumulateSuccessCount =
        await this.statisticsRepository.getAccumulateSuccessCount({
          userId,
          companyId,
        });

      // 누적 발송성공률 계산
      const accumulateSuccessRatio =
        (accumulateSuccessCount / accumulateSendCount) * 100;

      // 누적 클릭형 발송건수 조회
      const accumulateClickCount =
        await this.statisticsRepository.getAccumulateClickSendCount({
          userId,
          companyId,
        });

      // 누적 클릭 건수 조회
      const accumulateClickSuccessCount =
        await this.statisticsRepository.getAccumulateClickSuccessCount({
          userId,
          companyId,
        });

      // 누적 클릭률 계산
      const accumulateClickRatio =
        (accumulateClickSuccessCount.length / accumulateClickCount) * 100;

      // 시간별 통계 생성
      const hourlyStatistics =
        await this.statisticsRepository.createHourlyStatistics({
          userId,
          companyId,
          totalClientCount,
          totalGroupCount,
          accumulateSendCount,
          accumulateSuccessCount,
          accumulateSuccessRatio,
          accumulateClickRatio,
        });

      return hourlyStatistics;
    } catch (e) {
      console.error(e);
    }
  };

  // 일별 통계 생성
  createDailyStatistics = async ({ userId, companyId }) => {
    logger.info(`StatisticsService.createDailyStatistics Request`);
    try {
      // 특정일자 기준 가입일로부터 지나온 일자 계산
      const userJoinDate = await this.statisticsRepository.getJoinUser({
        userId,
        companyId,
      });
      const userAfterJoinDate = Math.ceil(
        (new Date() - userJoinDate.createdAt) / (1000 * 3600 * 24)
      );

      // 전체 고객 수 조회
      const totalClientCount =
        await this.statisticsRepository.getTotalClientsCount({
          userId,
          companyId,
        });

      // 전체 그룹 수 조회
      const totalGroupCount =
        await this.statisticsRepository.getTotalGroupsCount({
          userId,
          companyId,
        });

      // 누적 총 발송 건수 조회
      const accumulateSendCount =
        await this.statisticsRepository.getAccumulateSendCount({
          userId,
          companyId,
        });

      // 누적 발송성공 건수 조회
      const accumulateSuccessCount =
        await this.statisticsRepository.getAccumulateSuccessCount({
          userId,
          companyId,
        });

      // 누적 발송성공률 계산
      const accumulateSuccessRatio =
        (accumulateSuccessCount / accumulateSendCount) * 100;

      // 누적 클릭형 발송건수 조회
      const accumulateClickCount =
        await this.statisticsRepository.getAccumulateClickSendCount({
          userId,
          companyId,
        });

      // 누적 클릭 건수 조회
      const accumulateClickSuccessCount =
        await this.statisticsRepository.getAccumulateClickSuccessCount({
          userId,
          companyId,
        });

      // 누적 클릭률 계산
      const accumulateClickRatio =
        (accumulateClickSuccessCount.length / accumulateClickCount) * 100;

      // 데일리 통계 생성
      const dailyStatistics =
        await this.statisticsRepository.createDaliyStatistics({
          userId,
          companyId,
          userAfterJoinDate,
          totalClientCount,
          totalGroupCount,
          accumulateSendCount,
          accumulateSuccessCount,
          accumulateSuccessRatio,
          accumulateClickRatio,
        });

      return dailyStatistics;
    } catch (e) {
      console.error(e);
    }
  };

  // 가장 최신의 시간 기준 통계 조회
  getLatestHourlyStatistic = async ({ userId, companyId }) => {
    logger.info(`StatisticsService.getLatestHourlyStatistic Request`);
    const currentStatistic =
      await this.statisticsRepository.getLatestHourlyStatistic({
        userId,
        companyId,
      });
    return currentStatistic;
  };

  // 시간별 통계 조회
  getHourlyStatistic = async ({ userId, companyId }) => {
    logger.info(`StatisticsService.getHourlyStatistic Request`);
    const hourlyStatistic = await this.statisticsRepository.getHourlyStatistic({
      userId,
      companyId,
    });

    return hourlyStatistic.map((data) => new CurrentStatisticsDto(data));
  };

  // 현재 실시간 통계 조회
  getCurrentStatistic = async ({ userId, companyId }) => {
    logger.info(`StatisticsService.getCurrentStatistic Request`);
    try {
      // 전체 고객 수 조회
      const totalClientCount =
        await this.statisticsRepository.getTotalClientsCount({
          userId,
          companyId,
        });

      // 전체 그룹 수 조회
      const totalGroupCount =
        await this.statisticsRepository.getTotalGroupsCount({
          userId,
          companyId,
        });

      // 누적 총 발송 건수 조회
      const accumulateSendCount =
        await this.statisticsRepository.getAccumulateSendCount({
          userId,
          companyId,
        });

      // 누적 발송성공 건수 조회
      const accumulateSuccessCount =
        await this.statisticsRepository.getAccumulateSuccessCount({
          userId,
          companyId,
        });

      // 누적 발송성공률 계산
      const accumulateSuccessRatio =
        (accumulateSuccessCount / accumulateSendCount) * 100;

      // 누적 클릭형 발송건수 조회
      const accumulateClickCount =
        await this.statisticsRepository.getAccumulateClickSendCount({
          userId,
          companyId,
        });

      // 누적 클릭 건수 조회
      const accumulateClickSuccessCount =
        await this.statisticsRepository.getAccumulateClickSuccessCount({
          userId,
          companyId,
        });

      // 누적 클릭률 계산
      const accumulateClickRatio =
        (accumulateClickSuccessCount.length / accumulateClickCount) * 100;

      return {
        totalClientCount,
        totalGroupCount,
        accumulateSuccessRatio: accumulateSuccessRatio ?? 0,
        accumulateClickRatio: accumulateClickRatio ?? 0,
      };
    } catch (e) {
      console.error(e);
    }
  };
}

module.exports = StatisticsService;
