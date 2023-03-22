const express = require('express');
const router = express.Router();

const ClientGroupController = require('../controllers/clientGroup.controller');
const clientGroupController = new ClientGroupController();

router.post(
  '/clients/:clientId/groups/:groupId',
  clientGroupController.createClientGroup
);

router.post(
  '/clients/:clientId/groups/:groupId/copy',
  clientGroupController.copyClientGroup
);

router.post('/groups/:groupId', clientGroupController.createClientGroupBulk);

module.exports = router;
