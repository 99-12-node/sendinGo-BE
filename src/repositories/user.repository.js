const { Users, Companies, Groups, sequelize } = require('../db/models');
const { logger } = require('../middlewares/logger');

class UserRepository {
  findUserByUserId = async ({ userId }) => {
    logger.info(`UserRepository.findUserByUserId Request`);
    const user = await Users.findOne({
      attributes: ['name', 'phoneNumber', 'email'],
      where: { userId },
    });

    return user;
  };
  createUser = async ({
    email,
    password,
    phoneNumber,
    provider,
    name,
    role,
    status,
    companyId,
  }) => {
    logger.info(`UserRepository.createUser Request`);
    const newUser = await Users.create({
      email,
      password,
      phoneNumber,
      provider,
      name,
      role,
      status,
      companyId,
    });
    return newUser;
  };

  createNewUserAndCompany = async ({
    email,
    password,
    companyName,
    companyEmail,
    companyNumber,
    phoneNumber,
    name,
    provider,
    role,
  }) => {
    logger.info(`UserRepository.createNewUserAndCompany Request`);
    try {
      const result = await sequelize.transaction(async (t) => {
        const newCompany = await Companies.create(
          { companyName, companyNumber, companyEmail },
          { transaction: t }
        );

        const newUser = await Users.create(
          {
            email,
            password,
            phoneNumber,
            provider,
            name,
            role,
            companyId: newCompany.companyId,
          },
          { transaction: t }
        );

        const defaultGrouop = await Groups.create(
          {
            groupName: '미지정',
            companyId: newCompany.companyId,
            userId: newUser.userId,
          },
          { transaction: t }
        );

        return defaultGrouop;
      });
      return result;
    } catch (e) {
      console.error(e);
    }
  };

  findUserByEmail = async ({ email }) => {
    logger.info(`UserRepository.findUserByEmail Request`);
    const user = await Users.findOne({ where: { email } });

    return user;
  };

  findByUserId = async ({ userId }) => {
    logger.info(`UserRepository.findByUserId Request`);
    const user = await Users.findOne({ where: { userId } });

    return user;
  };

  editUser = async ({ email, password, phoneNumber, name, role, userId }) => {
    logger.info(`UserRepository.editUser Request`);
    const updatedUser = await Users.update(
      { email, password, phoneNumber, name, role },
      { where: { userId } }
    );
    return updatedUser;
  };

  deleteUser = async ({ userId }) => {
    logger.info(`UserRepository.deleteUser Request`);

    await Users.destroy({ where: { userId } });
    return;
  };
}

module.exports = UserRepository;
