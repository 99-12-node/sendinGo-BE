const UserRepository = require('../repositories/user.repository');

module.exports = class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }
  // 유저 등록
  createUser = async () => {};

  //유저 전체 조회
  checkUser = async () => {};

  //유저 삭제
  deleteUser = async () => {};
};
