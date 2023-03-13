const userRepository = require('../repositories/user.repository');

class userService {
  constructor() {
    this.userRepository = new userRepository();
  }
}

module.exports = userService;
