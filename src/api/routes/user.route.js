const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const userController = new UserController();

router.post('/signup', userController.createUser);
router.post('/signup/existemail', userController.checkUserEmail);
router.post('/login', userController.loginUser);
router.patch('/:userId', userController.editUser);
// router.delete('/:userId', userController.deleteUser);

module.exports = router;
