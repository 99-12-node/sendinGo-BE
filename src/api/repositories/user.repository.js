const { User } = require('../../db/models');

class userRepository {
  signupRepo = async ({
    email,
    password,
    company,
    phoneNumber,
    name,
    role,
  }) => {
    await User.create({ email, password, company, phoneNumber, name, role });
    return;
  };
}

module.exports = userRepository;
