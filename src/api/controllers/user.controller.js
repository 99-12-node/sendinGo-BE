const UserService = require('../services/user.service');
const { logger } = require('../../middlewares/logger');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { KEY, EXPIRE_IN } = process.env;

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  createUser = async (req, res, next) => {
    logger.info(`UserController.createUser Request`);
    const user = req.body;
    try {
      await this.userService.createUser(user);
      res.status(201).json({ message: '회원가입이 완료 되었습니다.' });
    } catch (e) {
      next(e);
    }
  };

  checkUserEmail = async (req, res, next) => {
    logger.info(`UserController.checkUserEmail Request`);
    const { email } = req.body;
    await this.userService.checkUserEmail({ email });

    res.stutus(200).json({ message: '사용가능 한 이메일 입니다.' });
  };

  loginUser = async (req, res, next) => {
    logger.info(`UserController.loginUser Request`);
    const { email, password } = req.body;
    try {
      const user = await this.userService.loginUser({ email, password });

      let expires = new Date();
      expires.setMinutes(expires.getMinutes() + 60);

      const token = jwt.sign({ userId: user.email }, KEY, {
        expiresIn: EXPIRE_IN,
      });
      res.cookie('authorization', `Bearer ${token}`, {
        expires: expires,
      });
      res.status(200).json({ message: '로그인이 정상적으로 처리되었습니다.' });
    } catch (e) {
      next(e);
    }
  };

  editUser = async (req, res, next) => {
    logger.info(`UserController.editUser Request`);
    const { userId } = res.locals.user;
    const user = { ...req.body, userId };
    try {
      await this.userService.editUser(user);

      res.status(200).json({ message: '회원 정보 수정이 완료되었습니다.' });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = UserController;
