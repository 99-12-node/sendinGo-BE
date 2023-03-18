const express = require('express');
const router = express.Router();

const GroupController = require('../controllers/group.controller');
const groupController = new GroupController();

router.post('/', groupController.createGroup);
router.get('/', groupController.getAllGroup);
router.delete('/:groupId', groupController.deleteGroup);

module.exports = router;
