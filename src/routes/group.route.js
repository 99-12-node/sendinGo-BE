const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const JoiHelper = require('../helpers/joi.Helper');
const createStatistic = require('../utils/statistic.schedule');

const GroupController = require('../controllers/group.controller');
const groupController = new GroupController();

router.post(
  '/',
  authMiddleware,
  createStatistic,
  JoiHelper.groupCheck,
  groupController.createGroup
);
router.get('/', authMiddleware, createStatistic, groupController.getAllGroup);
router.delete(
  '/:groupId',
  authMiddleware,
  createStatistic,
  JoiHelper.groupId,
  groupController.deleteGroup
);

module.exports = router;
