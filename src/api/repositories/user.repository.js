const { Users } = require('../../db/models');

class UserRepository {
  createUser = async ({
    email,
    password,
    phoneNumber,
    provider,
    name,
    status,
    companyId,
  }) => {
    await Users.create({
      email,
      password,
      phoneNumber,
      provider,
      name,
      status,
      companyId,
    });
    return;
  };

  findUser = async ({ email }) => {
    const user = await Users.findOne({ where: { email } });

    return user;
  };

  editUser = async ({ email, password, phoneNumber, name }) => {
    await Users.update(
      { email, password, phoneNumber, name },
      { where: { userId } }
    );
  };
}

module.exports = UserRepository;
