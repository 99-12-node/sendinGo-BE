const express = require('express');
const router = express.Router();

const ClientGroupController = require('../controllers/clientGroup.controller');
const clientGroupController = new ClientGroupController();

router.post(
  '/clients/:clientId/groups/:groupId',
  clientGroupController.createClientGroup
);
router.post(
  '/clients/:clientId/groups/:existGroupId/move/:newGroupId',
  clientGroupController.moveClientGroup
);

router.post(
  '/clients/:clientId/groups/:existGroupId/copy/:newGroupId',
  clientGroupController.copyClientGroup
);

router.post('/groups/:groupId', clientGroupController.createClientGroupBulk);

router.post('/groups', clientGroupController.createNewClientGroupBulk);

module.exports = router;
