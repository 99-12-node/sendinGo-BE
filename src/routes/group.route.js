const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

const GroupController = require('../controllers/group.controller');
const groupController = new GroupController();

router.post('/', authMiddleware, groupController.createGroup);
router.get('/', authMiddleware, groupController.getAllGroup);
router.delete('/:groupId', authMiddleware, groupController.deleteGroup);

module.exports = router;
