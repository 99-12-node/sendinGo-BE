const jwt = require('jsonwebtoken');
const { Users, Companies } = require('../db/models');
const { UnauthorizedError } = require('../exceptions/errors');
const { logger } = require('../middlewares/logger');
require('dotenv').config();
const { KEY } = process.env;

module.exports = async (req, res, next) => {
  logger.info(`auth.middleware.module.exports Request`);
  const { Authorization } = req.headers;
  const [tokenType, token] = (Authorization ?? '').split(' ');

  if (tokenType !== 'Bearer' || !token) {
    throw new UnauthorizedError(
      '토큰 타입이 일치하지 않거나, 토큰이 존재하지 않습니다.'
    );
  }
  logger.info(`auth.middleware.userdecoded`);

  try {
    const decodedToken = jwt.verify(token, KEY);
    const userId = decodedToken.userId;
    const companyId = decodedToken.companyId;
    const company = await Companies.findOne({ where: { companyId } });
    const user = await Users.findOne({ where: { userId } });

    if (!user) {
      throw new UnauthorizedError(
        '토큰에 해당하는 사용자가 존재하지 않습니다.'
      );
    }
    if (!company) {
      throw new UnauthorizedError('토큰에 해당하는 소속이 존재하지 않습니다.');
    }
    logger.info(`auth.middleware.user.company Request`);
    res.locals.user = user;
    res.locals.company = company;
    next();
  } catch (error) {
    res.clearCookie('authorization');
    next(error);
  }
};
