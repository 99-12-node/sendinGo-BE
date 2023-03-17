const UserRepository = require('../repositories/user.repository');
const CompanyRepository = require('../repositories/company.repository');
const bcrypt = require('bcrypt');
const { BadRequestError, Conflict } = require('../../exceptions/errors');
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
    try {
      const salt = await bcrypt.genSalt(SALT);
      const hashedPassword = await bcrypt.hash(password, salt);

      const existCompany = await this.companyRepository.findCompanyByName({
        companyName,
      });

      if (!existCompany) {
        await this.userRepository.createNewUserAndCompany({
          email,
          password: hashedPassword,
          companyName,
          companyNumber,
          phoneNumber,
          provider: 0,
          name,
          role: 0,
        });
      } else {
        await this.userRepository.createUser({
          email,
          password: hashedPassword,
          phoneNumber,
          provider: 0,
          name,
          role: 0,
          companyId: existCompany.companyId,
        });
      }
      return;
    } catch (e) {
      console.error(e.errors[0].message);
      console.error(e.parent.message);
      if (e.message === 'Validation error') {
        throw new BadRequestError(e.errors[0].message);
      }
    }
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
