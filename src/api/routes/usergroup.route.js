const express = require('express');
const router = express.Router();

const UserGroupController = require('../controllers/usergroup.controller');
const userGroupController = new UserGroupController();

router.post('/groups', userGroupController.createUserGroup);

module.exports = router;
