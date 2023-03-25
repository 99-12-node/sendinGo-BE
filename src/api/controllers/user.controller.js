const UserService = require('../services/user.service');
const _ = require('lodash');
const { logger } = require('../../middlewares/logger');
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  Conflict,
} = require('../../exceptions/errors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { KEY, EXPIRE_IN } = process.env;

const emailValidation =
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordValidation =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{8,20}$/;
const nameValidation = /^[a-zA-Z가-힣\s]+$/;
const phoneNumberValidation = /^[0-9]{10,11}$/;

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  getUser = async (req, res, next) => {
    logger.info(`UserController.getUser Request`);

    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const requestUserId = parseInt(req.params.userId);
    try {
      if (userId !== requestUserId) {
        throw new ForbiddenError(
          '요청하신 회원의 정보와 토큰의 정보가 일치하지 않습니다.'
        );
      }

      const data = await this.userService.getUser({
        userId,
        companyId,
      });

      res.status(200).json({ data });
    } catch (e) {
      next(e);
    }
  };

  createUser = async (req, res, next) => {
    logger.info(`UserController.createUser Request`);
    const user = req.body;

    try {
      if (
        _.isEmpty(user) ||
        _.some(
          [
            'email',
            'password',
            'name',
            'phoneNumber',
            'companyName',
            'companyEmail',
            'companyNumber',
          ],
          (field) => !user[field]
        )
      ) {
        throw new BadRequestError('필수 정보를 모두 입력해주세요.');
      }
      if (!emailValidation.test(user.email)) {
        throw new BadRequestError('이메일 형식에 맞춰 입력 바랍니다.');
      }
      if (!passwordValidation.test(user.password)) {
        throw new BadRequestError(
          '비밀번호는 영문 대/소문자, 숫자 각 1자리 이상 포함한 8~20자리 조합입니다.'
        );
      }
      if (!nameValidation.test(user.name)) {
        throw new BadRequestError('이름 입력란을 다시 확인해주세요.');
      }
      if (!phoneNumberValidation.test(user.phoneNumber)) {
        throw new BadRequestError(
          '핸드폰 번호는 - 를 제외한 10~11 자리 입니다.'
        );
      }
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
      if (!emailValidation.test(email)) {
        throw new BadRequestError('이메일 형식에 맞춰 입력 바랍니다.');
      }
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
      if (!email || !password) {
        throw new BadRequestError('이메일 비밀번호를 모두 입력해야 합니다.');
      }
      if (!emailValidation.test(email)) {
        throw new BadRequestError('이메일 형식에 맞춰 입력 바랍니다.');
      }
      if (!passwordValidation.test(password)) {
        throw new BadRequestError(
          '비밀번호는 영문 대/소문자, 숫자 각 1자리 이상 포함한 8~20자리 조합입니다.'
        );
      }
      const user = await this.userService.loginUser({ email, password });

      const token = jwt.sign(
        { userId: user.userId, companyId: user.companyId },
        KEY
      );
      res.setHeader('Authorization', `Bearer ${token}`);
      res.status(200).json({ message: '로그인이 정상적으로 처리되었습니다.' });
    } catch (e) {
      next(e);
    }
  };

  editUser = async (req, res, next) => {
    logger.info(`UserController.editUser Request`);
    const user = res.locals.user;
    const updateInfo = req.body;
    const requestUserId = parseInt(req.params.userId);
    try {
      if (user.userId !== requestUserId) {
        throw new ForbiddenError(
          '요청하신 회원의 정보와 토큰의 정보가 일치 하지않아 수정이 불가합니다.'
        );
      }

      if (
        _.isEmpty(updateInfo) ||
        _.some(
          [
            'email',
            'password',
            'name',
            'phoneNumber',
            'companyName',
            'companyEmail',
            'companyNumber',
          ],
          (field) => !updateInfo[field]
        )
      ) {
        throw new BadRequestError('필수 정보를 모두 입력해주세요.');
      }
      if (!emailValidation.test(updateInfo.email)) {
        throw new BadRequestError('이메일 형식에 맞춰 입력 바랍니다.');
      }
      if (!passwordValidation.test(updateInfo.password)) {
        throw new BadRequestError(
          '비밀번호는 영문 대/소문자, 숫자 각 1자리 이상 포함한 8~20자리 조합입니다.'
        );
      }
      if (!nameValidation.test(updateInfo.name)) {
        throw new BadRequestError('이름 입력란을 다시 확인해주세요.');
      }
      if (!phoneNumberValidation.test(updateInfo.phoneNumber)) {
        throw new BadRequestError(
          '핸드폰 번호는 - 를 제외한 10~11 자리 입니다.'
        );
      }
      const requestData = { user, updateInfo };

      await this.userService.editUser(requestData);

      res.status(200).json({ message: '회원 정보 수정이 완료되었습니다.' });
    } catch (e) {
      next(e);
    }
  };

  deleteUser = async (req, res, next) => {
    logger.info(`UserController.deleteUser Request`);
    const user = res.locals.user;
    const requestUserId = parseInt(req.params.userId);

    try {
      if (user.userId !== requestUserId) {
        throw new ForbiddenError(
          '요청하신 회원의 정보와 토큰의 정보가 일치 하지않아 탈퇴가 불가합니다.'
        );
      }

      await this.userService.deleteUser(user);

      res.status(200).json({ message: '회원 탈퇴가 완료 되었습니다.' });
    } catch (e) {
      next(e);
    }
  };
}

module.exports = UserController;
