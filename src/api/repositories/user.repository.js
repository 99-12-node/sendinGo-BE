const { Users } = require('../../db/models');

class UserRepository {
  createUser = async ({
    email,
    password,
    company,
    companyNumber,
    phoneNumber,
    provider,
    name,
    role,
    status,
  }) => {
    await Users.create({
      email,
      password,
      phoneNumber,
      provider,
      name,
      role,
      status,
    });
    return;
  };

  findUser = async ({ email }) => {
    const user = await Users.findOne({ where: email });

    return user;
  };
}

module.exports = UserRepository;
