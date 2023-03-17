const { Users, Companies, sequelize } = require('../../db/models');

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

  createNewUserAndCompany = async ({
    email,
    password,
    companyName,
    companyNumber,
    phoneNumber,
    name,
    provider,
    role,
  }) => {
    try {
      const result = await sequelize.transaction(async (t) => {
        const newCompany = await Companies.create(
          { companyName, companyNumber },
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
      });

      return result;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  findUser = async ({ email }) => {
    const user = await Users.findOne({ where: { email } });

    return user;
  };
}

module.exports = UserRepository;
