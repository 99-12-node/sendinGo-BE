const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const JoiHelper = require('../helpers/joi.Helper');

const ClientGroupController = require('../controllers/clientGroup.controller');
const clientGroupController = new ClientGroupController();

// 클라이언트 기존 그룹에 추가 및 해제
router.post(
  '/clients/:clientId/groups/:groupId',
  authMiddleware,
  JoiHelper.clientGroupCheck,
  clientGroupController.createClientGroup
);

// 클라이언트 다른 그룹으로 이동
router.post(
  '/clients/:clientId/groups/:existGroupId/move/:newGroupId',
  authMiddleware,
  JoiHelper.groupIdCheck,
  clientGroupController.moveClientGroup
);

// 클라이언트 다른 그룹으로 복사
router.post(
  '/clients/:clientId/groups/:existGroupId/copy/:newGroupId',
  authMiddleware,
  JoiHelper.groupIdCheck,
  clientGroupController.copyClientGroup
);

// 대량 클라이언트 기존 그룹에 추가 및 해제
router.post(
  '/groups/:groupId',
  authMiddleware,
  clientGroupController.createClientGroupBulk
);

// 대량 클라이언트 신규 그룹에 추가 및 해제
router.post(
  '/groups',
  authMiddleware,
  clientGroupController.createNewClientGroupBulk
);

module.exports = router;
