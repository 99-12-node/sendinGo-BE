const UserService = require('../services/user.service');
const { logger } = require('../../middlewares/logger');
const { UnauthorizedError } = require('../../exceptions/errors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { KEY, EXPIRE_IN } = process.env;

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  getUser = async (req, res, next) => {
    logger.info(`UserController.getUser Request`);

    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const requestUserId = req.params.userId;

    if (userId != requestUserId) {
      throw new UnauthorizedError(
        '요청하신 회원의 정보와 토큰의 정보가 일치하지 않습니다.'
      );
    }

    const data = await this.userService.getUser({
      userId,
      companyId,
    });

    res.status(200).json({ data });
  };

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
    try {
      await this.userService.checkUserEmail({ email });

      res.status(200).json({ message: '사용가능 한 이메일 입니다.' });
    } catch (e) {
      next(e);
    }
  };

  loginUser = async (req, res, next) => {
    logger.info(`UserController.loginUser Request`);
    const { email, password } = req.body;
    try {
      const user = await this.userService.loginUser({ email, password });

      let expires = new Date();
      expires.setMinutes(expires.getMinutes() + 60);

      const token = jwt.sign(
        { userId: user.userId, companyId: user.companyId },
        KEY,
        {
          expiresIn: EXPIRE_IN,
        }
      );
      res.cookie('authorization', `Bearer ${token}`, { expires });
      res.status(200).json({ message: '로그인이 정상적으로 처리되었습니다.' });
    } catch (e) {
      next(e);
    }
  };

  editUser = async (req, res, next) => {
    logger.info(`UserController.editUser Request`);
    const user = res.locals.user;
    const updateInfo = { ...req.body };
    const requestData = { user, updateInfo };
    try {
      await this.userService.editUser(requestData);

      res.status(200).json({ message: '회원 정보 수정이 완료되었습니다.' });
    } catch (e) {
      next(e);
    }
  };

  deleteUser = async (req, res, next) => {
    logger.info(`UserController.deleteUser Request`);
    const user = res.locals.user;
    await this.userService.deleteUser(user);

    res.status(200).json({ message: '회원 탈퇴가 완료 되었습니다.' });
  };
}

module.exports = UserController;
