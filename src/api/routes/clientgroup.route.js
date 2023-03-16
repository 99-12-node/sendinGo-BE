const express = require('express');
const router = express.Router();

const ClientGroupController = require('../controllers/clientgroup.controller');
const clientGroupController = new ClientGroupController();

router.get('/', clientGroupController.getAllGroup);

module.exports = router;
