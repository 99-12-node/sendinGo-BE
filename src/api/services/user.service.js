const UserRepository = require('../repositories/user.repository');
const CompanyRepository = require('../repositories/company.repository');
const { logger } = require('../../middlewares/logger');
const bcrypt = require('bcrypt');
const { BadRequestError, Conflict } = require('../../exceptions/errors');
require('dotenv').config();
const SALT = parseInt(process.env.SALT);

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
    this.companyRepository = new CompanyRepository();
  }

  getUser = async ({ userId, companyId }) => {
    logger.info(`UserService.getUser Request`);
    const user = await this.userRepository.findUserByUserId({ userId });
    const company = await this.companyRepository.findCompanyByCompanyId({
      companyId,
    });

    return { user, company };
  };

  createUser = async ({
    email,
    password,
    companyName,
    companyNumber,
    phoneNumber,
    name,
  }) => {
    try {
      logger.info(`UserService.createUser Request`);
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
          role,
        });
      } else {
        await this.userRepository.createUser({
          email,
          password: hashedPassword,
          phoneNumber,
          provider: 0,
          name,
          role,
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

  checkUserEmail = async ({ email }) => {
    logger.info(`UserService.checkUserEmail Request`);
    const user = await this.userRepository.findUserByEmail({ email });

    if (user) {
      throw new Conflict('중복 된 이메일이 존재합니다.');
    }

    return;
  };

  loginUser = async ({ email, password }) => {
    logger.info(`UserService.loginUser Request`);
    const user = await this.userRepository.findUserByEmail({ email });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!user) {
      throw new BadRequestError('이메일이 존재하지 않습니다.');
    }
    if (!isPasswordCorrect) {
      throw new BadRequestError('비밀번호가 일치하지 않습니다.');
    }

    return user;
  };

  editUser = async ({
    email,
    password,
    companyName,
    companyNumber,
    phoneNumber,
    name,
    userId,
  }) => {
    logger.info(`UserService.editUser ${email}Request`);
    const salt = await bcrypt.genSalt(SALT);
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.userRepository.editUser({
      email,
      password: hashedPassword,
      phoneNumber,
      name,
      userId,
    });

    const updatedUser = await this.userRepository.findByUserId({ userId });

    await this.companyRepository.editCompany({
      companyName,
      companyNumber,
      companyId: updatedUser.companyId,
    });

    return;
  };

  deleteUser = async (user) => {
    if (user.role === 0) {
      await this.userRepository.deleteUser({ userId: user.userId });
      await this.companyRepository.deleteCompany({ companyId: user.companyId });
    } else {
      await this.userRepository.deleteUser({ userId: user.userId });
    }

    return;
  };
}

module.exports = UserService;
