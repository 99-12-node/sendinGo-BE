const userRepository = require('../repositories/user.repository');
const { BadRequestError } = require('../../exceptions/errors');

class userService {
  constructor() {
    this.userRepository = new userRepository();
  }

  createUser = async ({
    email,
    password,
    company,
    phoneNumber,
    provider,
    name,
    role,
    status,
  }) => {
    await this.userRepository.createUser({
      email,
      password,
      company,
      phoneNumber,
      provider,
      name,
      role,
      status,
    });

    return;
  };

  loginUser = async ({ email, password }) => {
    const user = await this.userRepository.loginUser({ email });

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
