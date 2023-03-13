const { logger } = require('../middlewares/logger');
const UserService = require('../services/user.service');

module.exports = class userController {
  constructor() {
    this.userService = new UserService();
  }

  // 유저 등록
  createUser = async (req, res, next) => {
    const { user, phondNumber } = req.body;

    try {
      await this.UserService.createUser({
        user,
        phondNumber,
      });

      return res.status(201).json({ message: '유저가 등록되었습니다.' });
    } catch (error) {
      next(error);
    }
  };

  //유저 전체 조회
  checkUser = async (req, res, next) => {
    try {
      const allData = await this.userService.checkUser();

      return res.status(200).json({ allData });
    } catch (error) {
      next(error);
    }
  };

  //유저 삭제
  deleteUser = async (req, res, next) => {};
};
