const { Users } = require('../../db/models');
const { logger } = require('../../middlewares/logger');

class UserRepository {
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
    await Users.create({
      email,
      password,
      phoneNumber,
      provider,
      name,
      role,
      status,
      companyId,
    });
    return;
  };

  findUser = async ({ email }) => {
    logger.info(`UserRepository.findUser Request`);
    const user = await Users.findOne({ where: { email } });

    return user;
  };
  findByUserId = async ({ userId }) => {
    logger.info(`UserRepository.findUser Request`);
    const user = await Users.findOne({ where: { userId } });

    return user;
  };

  editUser = async ({ email, password, phoneNumber, name, userId }) => {
    logger.info(`UserRepository.editUser Request`);
    const updatedUser = await Users.update(
      { email, password, phoneNumber, name },
      { where: { userId } }
    );
    return updatedUser;
  };
}

module.exports = UserRepository;
