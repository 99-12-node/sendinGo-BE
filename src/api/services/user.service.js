const userRepository = require('../repositories/user.repository');

class userService {
  constructor() {
    this.userRepository = new userRepository();
  }

  signupService = async ({
    email,
    password,
    company,
    phoneNumber,
    name,
    role,
  }) => {
    await this.userRepository.signupRepo({
      email,
      password,
      company,
      phoneNumber,
      name,
      role,
    });

    return;
  };
}

module.exports = userService;
