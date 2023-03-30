const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

const ClientGroupController = require('../controllers/clientGroup.controller');
const clientGroupController = new ClientGroupController();

router.post(
  '/clients/:clientId/groups/:groupId',
  authMiddleware,
  clientGroupController.createClientGroup
);
router.post(
  '/clients/:clientId/groups/:existGroupId/move/:newGroupId',
  authMiddleware,
  clientGroupController.moveClientGroup
);

router.post(
  '/clients/:clientId/groups/:existGroupId/copy/:newGroupId',
  authMiddleware,
  clientGroupController.copyClientGroup
);

router.post(
  '/groups/:groupId',
  authMiddleware,
  clientGroupController.createClientGroupBulk
);

router.post(
  '/groups',
  authMiddleware,
  clientGroupController.createNewClientGroupBulk
);

module.exports = router;
