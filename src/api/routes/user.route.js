const express = require('express');
const router = express.Router();
const JoiHelper = require('../../helpers/user.joiHelper');
const UserController = require('../controllers/user.controller');
const authMiddleWare = require('../../middlewares/auth.middleware');
const userController = new UserController();

router.post('/signup', JoiHelper.signUpCheck, userController.createUser);
router.post('/signup/existemail', userController.checkUserEmail);
router.post('/login', userController.loginUser);
router.get('/:userId', authMiddleWare, userController.getUser);
router.patch('/:userId', authMiddleWare, userController.editUser);
router.delete('/:userId', authMiddleWare, userController.deleteUser);

module.exports = router;
