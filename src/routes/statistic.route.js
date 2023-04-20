const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const CronJob = require('cron').CronJob;
const {
  createHourlyStatistics,
  createDailyStatistics,
  createWeeklyStatistics,
} = require('../utils/statistic.schedule');

const StatisticController = require('../controllers/statistic.controller');
const statisticController = new StatisticController();

const { controllerLogger } = require('../middlewares/logger.middleware.js');
const { logger } = require('../middlewares/logger');
router.use(controllerLogger);

// 이미 실행 중인 작업 이름 저장소
const scheduledJobs = new Set();
const scheduleJobUnique = (name, cronTime, onTick) => {
  // 이미 등록된 작업인지 확인
  if (scheduledJobs.has(name)) {
    console.error(`Job "${name}" already exists!`);
    return;
  }
  if (parseInt(process.env.INSTANCE_ID) === 0) {
    // 새로운 작업 등록
    const job = new CronJob(cronTime, onTick, {
      onComplete: () => {
        scheduledJobs.delete(name);
      },
    });
    job.start();
    scheduledJobs.add(name);
  }
};
// 시간별 통계
scheduleJobUnique('Hourly', '0 * * * *', () => {
  logger.info(`Hourly Statistic!`);
  createHourlyStatistics();
});
// 일별 통계
scheduleJobUnique('Daily', '0 0 * * *', () => {
  logger.info(`Daily Statistic!`);
  createDailyStatistics();
});
// 주별 통계
scheduleJobUnique('Weekly', '0 0 * * 1', () => {
  logger.info(` Weekly Statistic!`);
  createWeeklyStatistics();
});

/**
 * Response
 * @typedef {object} Response
 * @property {string} message - 결과 메시지
 */

/**
 * GET /statistics/current
 * @summary 현재 통계 정보 조회
 * @tags Statistics
 * @return {object<Response>} 200 - Success response
 * @return {object<Response>} 401 - Unauthorized response
 * @example response - 200 - 조회 성공
 * {
 *  "data": {
 * "totalClientCount": 10,
 * "totalGroupCount": 3,
 * "accumulateSuccessRatio": 100,
 * "accumulateClickRatio": 9.375,
 * "createdAt": "2023-04-10T20:38:00.000Z"
 * }
 * }
 * @example response - 401 - 인증 자격 증명 실패
 * {
 *     "message": "토큰에 해당하는 사용자 또는 소속이 존재하지 않습니다"
 * }
 * @security Authorization
 */
router.get('/current', authMiddleware, statisticController.getCurrentStatistic);

/**
 * GET /statistics/hourly
 * @summary 시간별 통계 정보 조회
 * @tags Statistics
 * @return {object<Response>} 200 - Success response
 * @return {object<Response>} 401 - Unauthorized response
 * @example response - 200 - 조회 성공
 * {
 *  "data": [
 *   {
 *     "totalClientCount": 10,
 *     "totalGroupCount": 3,
 *     "accumulateSuccessRatio": 100,
 *     "accumulateClickRatio": 9.375,
 *     "createdAt": "2023-04-10T20:00:03.000Z"
 *   },
 *   {
 *     "totalClientCount": 13,
 *     "totalGroupCount": 4,
 *     "accumulateSuccessRatio": 100,
 *     "accumulateClickRatio": 9.375,
 *     "createdAt": "2023-04-10T21:00:00.000Z"
 *   }
 *  ]
 * }
 * @example response - 401 - 인증 자격 증명 실패
 * {
 *     "message": "토큰에 해당하는 사용자 또는 소속이 존재하지 않습니다"
 * }
 * @security Authorization
 */
router.get('/hourly', authMiddleware, statisticController.getHourlyStatistic);

/**
 * GET /statistics/daily
 * @summary 일별 통계 정보 조회
 * @tags Statistics
 * @return {object<Response>} 200 - Success response
 * @return {object<Response>} 401 - Unauthorized response
 * @example response - 200 - 조회 성공
 * {
 *  "data": [
 *   {
 *     "totalClientCount": 10,
 *     "totalGroupCount": 3,
 *     "accumulateSuccessRatio": 100,
 *     "accumulateClickRatio": 9.375,
 *     "createdAt": "2023-04-10T00:00:03.000Z"
 *   },
 *   {
 *     "totalClientCount": 1,
 *     "totalGroupCount": 0,
 *     "accumulateSuccessRatio": 0,
 *     "accumulateClickRatio": 0,
 *     "createdAt": "2023-04-03T00:00:00.000Z"
 *   }
 *  ]
 * }
 * @example response - 401 - 인증 자격 증명 실패
 * {
 *     "message": "토큰에 해당하는 사용자 또는 소속이 존재하지 않습니다"
 * }
 * @security Authorization
 */
router.get('/daily', authMiddleware, statisticController.getDailyStatistic);

/**
 * GET /statistics/weekly
 * @summary 주별 통계 정보 조회
 * @tags Statistics
 * @return {object<Response>} 200 - Success response
 * @return {object<Response>} 401 - Unauthorized response
 * @example response - 200 - 조회 성공
 * {
 *  "data": [
 *   {
 *     "totalClientCount": 10,
 *     "totalGroupCount": 3,
 *     "accumulateSuccessRatio": 100,
 *     "accumulateClickRatio": 9.375,
 *     "createdAt": "2023-04-10T00:00:03.000Z"
 *   },
 *   {
 *     "totalClientCount": 1,
 *     "totalGroupCount": 0,
 *     "accumulateSuccessRatio": 0,
 *     "accumulateClickRatio": 0,
 *     "createdAt": "2023-04-03T00:00:00.000Z"
 *   }
 *  ]
 * }
 @return {object<Response>} 401 - Unauthorized response
 * @example response - 200 - 조회 성공
 * {
 *  "data": [
 *   {
 *     "totalClientCount": 10,
 *     "totalGroupCount": 3,
 *     "accumulateSuccessRatio": 100,
 *     "accumulateClickRatio": 9.375,
 *     "createdAt": "2023-04-10T00:00:03.000Z"
 *   },
 *   {
 *     "totalClientCount": 1,
 *     "totalGroupCount": 0,
 *     "accumulateSuccessRatio": 0,
 *     "accumulateClickRatio": 0,
 *     "createdAt": "2023-04-03T00:00:00.000Z"
 *   }
 *  ]
 * }
 * @example response - 401 - 인증 자격 증명 실패
 * {
 *     "message": "토큰에 해당하는 사용자 또는 소속이 존재하지 않습니다"
 * }
 * @security Authorization
 */
router.get('/weekly', authMiddleware, statisticController.getWeeklyStatistic);

module.exports = router;
