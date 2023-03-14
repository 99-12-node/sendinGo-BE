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

  loginController = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await this.userService.loginService({ email, password });

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
