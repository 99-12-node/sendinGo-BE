const UserRepository = require('../repositories/user.repository');
const bcrypt = require('bcrypt');
const { BadRequestError } = require('../../exceptions/errors');
require('dotenv').config();
const { SALT } = process.env;

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
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
    const salt = await bcrypt.genSalt(SALT);
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.userRepository.createUser({
      email,
      password: hashedPassword,
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
    const user = await this.userRepository.findUser({ email });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!user) {
      throw new BadRequestError('이메일이 존재하지 않습니다.');
    }
    if (!isPasswordCorrect) {
      throw new BadRequestError('비밀번호가 일치하지 않습니다.');
    }

    return;
  };
}

module.exports = UserService;
