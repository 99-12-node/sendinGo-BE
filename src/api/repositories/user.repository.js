const { User } = require('../../db/models');

module.exports = class UserRepository {
  constructor() {}
  // 유저 생성
  createUser = async (user, phoneNumber) => {
    const createData = await User.createUser({
      user,
      phoneNumber,
    });
    return createData;
  };

  //유저 전체 조회
  checkUser = async () => {
    const allData = await User.findAll({});
    return allData;
  };

  //유저 삭제
  deleteUser = async () => {
    const deleteData = await User.destroy({});
    return deleteData;
  };
};
