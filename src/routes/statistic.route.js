const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const JoiHelper = require('../helpers/joi.Helper');

const StatisticController = require('../controllers/statistic.controller');
const statisticController = new StatisticController();

router.get('/current', authMiddleware, statisticController.getCurrentStatistic);
router.get('/hourly', authMiddleware, statisticController.getHourlyStatistic);

module.exports = router;
