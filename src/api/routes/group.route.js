const express = require('express');
const router = express.Router();

const GroupController = require('../controllers/group.controller');
const roupController = new GroupController();

router.get('/', GroupController.getAllGroup);

module.exports = router;
