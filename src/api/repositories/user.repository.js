const { Users } = require('../../db/models');

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
    const user = await Users.findOne({ where: { email } });

    return user;
  };
}

module.exports = UserRepository;
