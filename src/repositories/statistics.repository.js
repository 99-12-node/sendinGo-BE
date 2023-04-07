const { Statistics } = require('../db/models');
const { logger } = require('../middlewares/logger');

class StatisticsRepository {
  constructor() {}

  // 특정일자 기준 가입일로부터 지나온 일자 조회
  getAfterJoinDate = async () => {};

  // 전체 고객 수 조회
  getTotalClientsCount = async () => {};

  // 전체 그룹 수 조회
  getTotalGroupsCount = async () => {};

  // 누적 총 발송 건수 조회
  getAccumulateSendCount = async () => {};

  // 누적 발송성공 건수 조회
  getAccumulateSuccessCount = async () => {};

  // 누적 발송성공률 계산 및 조회
  getAccumulateSuccessRatio = async () => {};

  // 누적 클릭률 계산 및 조회
  getAccumulateClickRatio = async () => {};

  // 통계 저장
  createDailyStatistics = async () => {};
}

module.exports = StatisticsRepository;
