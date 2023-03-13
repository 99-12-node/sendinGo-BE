const userService = require('../services/user.repository');

class userCotroller {
  constructor() {
    this.userService = new userService();
  }

  signupController = async (res, res, next) => {
    const { email, password, company, phoneNumber, name, role } = req.body;
    await this.userService.signupService({
      email,
      password,
      company,
      phoneNumber,
      name,
      role,
    });

    res.status(201).json({ message: '회원가입이 완료 되었습니다.' });
  };
}

module.exports = userCotroller;
