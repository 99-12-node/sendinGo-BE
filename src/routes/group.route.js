const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const JoiHelper = require('../helpers/joi.Helper');

const GroupController = require('../controllers/group.controller');
const groupController = new GroupController();

router.post(
  '/',
  authMiddleware,
  JoiHelper.groupCheck,
  groupController.createGroup
);
router.get('/', authMiddleware, JoiHelper.groupId, groupController.getAllGroup);
router.delete(
  '/:groupId',
  authMiddleware,
  JoiHelper.groupId,
  groupController.deleteGroup
);

module.exports = router;
