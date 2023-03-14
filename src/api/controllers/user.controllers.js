const userService = require('../services/user.service');
require('dotenv').config();
const { KEY } = process.env;

class userCotroller {
  constructor() {
    this.userService = new userService();
  }

  createUser = async (res, res, next) => {
    const {
      email,
      password,
      company,
      companyNumber,
      phoneNumber,
      provider,
      name,
      role,
      status,
    } = req.body;
    await this.userService.createUser({
      email,
      password,
      company,
      companyNumber,
      phoneNumber,
      provider,
      name,
      role,
      status,
    });

    res.status(201).json({ message: '회원가입이 완료 되었습니다.' });
  };

  loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await this.userService.loginUser({ email, password });

    let expires = new Date();
    expires.setMinutes(expires.getMinutes() + 60);

    const token = jwt.sign({ userId: user.email }, KEY, { expiresIn: '1h' });

    res.cookie('authorization', `Bearer ${token}`, {
      expires: expires,
    });
    res.status(200).json({ message: '로그인이 정상적으로 처리되었습니다.' });
  };
}

module.exports = userCotroller;
