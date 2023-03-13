const userService = require('../services/user.repository');

class userCotroller {
  constructor() {
    this.userService = new userService();
  }
}

module.exports = userCotroller;
