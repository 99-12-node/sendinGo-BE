const express = require('express');
const router = express.Router();

const GroupController = require('../controllers/group.controller');
const groupController = new GroupController();

router.get('/', GroupController.getAllGroup);

module.exports = router;
