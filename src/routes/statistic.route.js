const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const JoiHelper = require('../helpers/joi.Helper');

const StatisticController = require('../controllers/statistic.controller');
const statisticController = new StatisticController();
const createStatistic = require('../utils/statistic.schedule');

const { controllerLogger } = require('../middlewares/logger.middleware.js');

router.use(controllerLogger);

router.get(
  '/current',
  authMiddleware,
  createStatistic,
  statisticController.getCurrentStatistic
);
router.get(
  '/hourly',
  authMiddleware,
  createStatistic,
  statisticController.getHourlyStatistic
);

module.exports = router;
