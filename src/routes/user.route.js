const express = require('express');
const router = express.Router();
const JoiHelper = require('../helpers/user.joiHelper.js');
const UserController = require('../controllers/user.controller');
const authMiddleWare = require('../middlewares/auth.middleware');
const userController = new UserController();

router.post('/signup', JoiHelper.signupCheck, userController.createUser);
router.post(
  '/signup/existemail',
  JoiHelper.existEmailCheck,
  userController.checkUserEmail
);
router.post('/login', JoiHelper.loginCheck, userController.loginUser);
router.get(
  '/:userId',
  authMiddleWare,
  JoiHelper.userIdAndRequestIdCheck,
  userController.getUser
);
router.patch(
  '/:userId',
  authMiddleWare,
  JoiHelper.editUserCheck,
  userController.editUser
);
router.delete(
  '/:userId',
  authMiddleWare,
  JoiHelper.userIdAndRequestIdCheck,
  userController.deleteUser
);

module.exports = router;
