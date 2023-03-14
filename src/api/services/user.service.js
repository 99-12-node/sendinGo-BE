const userRepository = require('../repositories/user.repository');
const { BadRequestError } = require('../../exceptions/errors');

class userService {
  constructor() {
    this.userRepository = new userRepository();
  }

  signupService = async ({
    email,
    password,
    company,
    phoneNumber,
    name,
    role,
  }) => {
    await this.userRepository.signupRepo({
      email,
      password,
      company,
      phoneNumber,
      name,
      role,
    });

    return;
  };

  loginService = async ({ email, password }) => {
    const user = await this.userRepository.loginRepo({ email });

    if (!user) {
      throw new BadRequestError({ message: '이메일이 존재하지 않습니다.' });
    }
    if (password !== user.password) {
      throw new BadRequestError({ message: '비밀번호가 일치하지 않습니다.' });
    }

    return;
  };
}

module.exports = userService;
