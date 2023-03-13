const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller');
const userController = new UserController();

router.post('/', userController.createUser);
router.get('/', userController.checkUser);
router.delete('/:userId', userController.deleteUser);

module.exports = router;
