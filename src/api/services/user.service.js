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
    if (!user || !company) {
      throw new BadRequestError(
        '해당하는 사용자 정보 또는 사용자의 회사 정보를 불러올 수 없습니다.'
      );
    }
    return { user, company };
  };

  createUser = async ({
    email,
    password,
    companyName,
    companyNumber,
    companyEmail,
    phoneNumber,
    name,
    role,
  }) => {
    try {
      logger.info(`UserService.createUser Request`);
      let result;
      const salt = await bcrypt.genSalt(SALT);
      const hashedPassword = await bcrypt.hash(password, salt);

      const existCompany = await this.companyRepository.findCompanyByName({
        companyName,
      });

      if (!existCompany) {
        result = await this.userRepository.createNewUserAndCompany({
          email,
          password: hashedPassword,
          companyName,
          companyNumber,
          companyEmail,
          phoneNumber,
          provider: 0,
          name,
          role,
        });
      } else {
        result = await this.userRepository.createUser({
          email,
          password: hashedPassword,
          phoneNumber,
          provider: 0,
          name,
          role,
          companyId: existCompany.companyId,
        });
      }
      if (!result) {
        throw new BadRequestError(result);
      }
      return result;
    } catch (e) {
      console.error(e.errors);
      throw new BadRequestError(
        '입력값을 다시 확인해주세요. (가입 이메일이나 소속명, 소속 이메일은 필수이며 중복이 불가합니다.)'
      );
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

    if (user === null) {
      throw new BadRequestError('이메일이 존재하지 않습니다.');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new BadRequestError('비밀번호가 일치하지 않습니다.');
    }

    return user;
  };

  editUser = async (requestData) => {
    logger.info(`UserService.editUser Request`);

    const { user, updateInfo } = requestData;

    const salt = await bcrypt.genSalt(SALT);
    const hashedPassword = await bcrypt.hash(updateInfo.password, salt);
    if (user.role === 0) {
      await this.userRepository.editUser({
        userId: user.userId,
        name: updateInfo.name,
        email: updateInfo.email,
        password: hashedPassword,
        phoneNumber: updateInfo.phoneNumber,
        role: updateInfo.role,
      });
      await this.companyRepository.editCompany({
        companyId: user.companyId,
        companyName: updateInfo.companyName,
        companyNumber: updateInfo.companyNumber,
        companyEmail: updateInfo.companyEmail,
      });
    } else {
      await this.userRepository.editUser({
        userId: user.userId,
        name: updateInfo.name,
        email: updateInfo.email,
        password: hashedPassword,
        phoneNumber: updateInfo.phoneNumber,
        role: updateInfo.role,
      });
    }
    return;
  };

  deleteUser = async (user) => {
    logger.info(`UserService.deleteUser Request`);

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
