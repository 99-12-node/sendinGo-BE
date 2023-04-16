const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const JoiHelper = require('../helpers/joi.Helper');

const StatisticController = require('../controllers/statistic.controller');
const statisticController = new StatisticController();

const { controllerLogger } = require('../middlewares/logger.middleware.js');

router.use(controllerLogger);

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

module.exports = router;
