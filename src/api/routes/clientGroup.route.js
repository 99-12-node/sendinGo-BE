const express = require('express');
const router = express.Router();

const ClientGroupController = require('../controllers/clientGroup.controller');
const clientGroupController = new ClientGroupController();

router.post(
  '/clients/:clientId/groups/:groupId',
  clientGroupController.createClientGroup
);

router.post('/groups/:groupId', clientGroupController.createClientGroupBulk);
router.post(
  '/clients/:clientId/groups/:groupId/move',
  clientGroupController.moveClientId
);

router.delete(
  '/clients/:clientId/groups/:groupId',
  clientGroupController.deleteClientGroup
);

module.exports = router;
