const jwt = require('jsonwebtoken');
const { Users } = require('../db/models');
const { UnauthorizedError } = require('../exceptions/errors');
require('dotenv').config();
const { KEY } = process.env;

module.exports = async (req, res, next) => {
  const { authorization } = req.cookies;
  const [tokenType, token] = (authorization ?? '').split(' ');

  if (tokenType !== 'Bearer' || !token) {
    throw new UnauthorizedError(
      '토큰 타입이 일치하지 않거나, 토큰이 존재하지 않습니다.'
    );
  }
  try {
    const decodedToken = jwt.verify(token, KEY);
    const userId = decodedToken.userId;
    const user = await Users.findOne({ where: { userId } });
    if (!user) {
      throw new UnauthorizedError(
        '토큰에 해당하는 사용자가 존재하지 않습니다.'
      );
    }

    res.locals.user = user;
    next();
  } catch (error) {
    res.clearCookie('authorization');
    next(error);
  }
};
