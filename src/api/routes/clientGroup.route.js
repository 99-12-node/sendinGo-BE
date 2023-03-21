const express = require('express');
const router = express.Router();

const ClientGroupController = require('../controllers/clientGroup.controller');
const clientGroupController = new ClientGroupController();

router.post(
  '/clients/:clientId/groups/:groupId',
  clientGroupController.createClientGroup
);

module.exports = router;
