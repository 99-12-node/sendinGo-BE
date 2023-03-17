const UserRepository = require('../repositories/user.repository');
const CompanyRepository = require('../repositories/company.repository');
const bcrypt = require('bcrypt');
const { BadRequestError } = require('../../exceptions/errors');
require('dotenv').config();
const SALT = parseInt(process.env.SALT);

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
    this.companyRepository = new CompanyRepository();
  }

  createUser = async ({
    email,
    password,
    companyName,
    companyNumber,
    phoneNumber,
    name,
  }) => {
    const salt = await bcrypt.genSalt(SALT);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newCompany = await this.companyRepository.createCompany({
      companyName,
      companyNumber,
    });

    await this.userRepository.createUser({
      email,
      password: hashedPassword,
      phoneNumber,
      provider: 0,
      name,
      role: 0,
      companyId: newCompany.companyId,
    });

    return;
  };

  checkUserEmail = async ({ email }) => {
    const user = await this.userRepository.findUser({ email });

    if (user) {
      throw new BadRequestError('중복 된 이메일이 존재합니다.');
    }

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

    return user;
  };
}

module.exports = UserService;
