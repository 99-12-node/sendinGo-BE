const Joi = require('joi');
const { logger } = require('../middlewares/logger');
const { BadRequestError, ForbiddenError } = require('../exceptions/errors');

const JoiHelper = {
  //Users
  signUpCheck: async (req, res, next) => {
    const check = Joi.object().keys({
      email: Joi.string()
        .email()
        .required()
        .error(new BadRequestError('email 형식에 맞춰서 입력 바랍니다.')),

      name: Joi.string()
        .required()
        .regex(/^([ㄱ-ㅎ|ㅏ-ㅣ|가-힣]){2,15}$/)
        .error(new BadRequestError('이름 입력란을 다시 확인해주세요.')),

      password: Joi.string()
        .required()
        .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{8,20}$/)
        .error(
          new BadRequestError(
            '비밀번호는 영문 대/소문자, 숫자 각 1자리 이상 포함한 8~20자리 조합입니다.'
          )
        ),

      confirmPassword: Joi.string()
        .required()
        .valid(Joi.ref('password'))
        .error(
          new BadRequestError('비밀번호와 비밀번호 확인이 일치하지 않습니다.')
        ),

      phoneNumber: Joi.string()
        .required()
        .regex(/^[0-9]{10,11}$/)
        .error(
          new BadRequestError('핸드폰 번호는 - 를 제외한 10~11 자리 입니다.')
        ),

      companyName: Joi.string()
        .required()
        .error(new BadRequestError('회사이름 입력란을 다시 확인해주세요.')),

      companyNumber: Joi.string()
        .required()
        .regex(/^[0-9]{4,11}$/)
        .error(new BadRequestError('회사 번호는 숫자만 입력이 가능합니다')),

      companyEmail: Joi.string()
        .email()
        .required()
        .error(
          new BadRequestError('회사 이메일을 이메일 형식에 맞게 기재 바랍니다.')
        ),
    });
    try {
      logger.info(`JoiHelper.signUpCheck Request`);
      await check.validateAsync(req.body);
    } catch (e) {
      next(e);
    }
    next();
  },

  loginCheck: async (req, res, next) => {
    const check = Joi.object().keys({
      email: Joi.string()
        .email()
        .required()
        .error(new BadRequestError('email 형식에 맞춰서 입력 바랍니다.')),

      password: Joi.string()
        .required()
        .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{8,20}$/)
        .error(
          new BadRequestError(
            '비밀번호는 영문 대/소문자, 숫자 각 1자리 이상 포함한 8~20자리 조합입니다.'
          )
        ),
    });
    try {
      logger.info(`JoiHelper.loginCheck Request`);
      await check.validateAsync(req.body);
    } catch (e) {
      next(e);
    }
    next();
  },

  existEmailCheck: async (req, res, next) => {
    const check = Joi.object().keys({
      email: Joi.string()
        .email()
        .required()
        .error(new BadRequestError('email 형식에 맞춰서 입력 바랍니다.')),
    });
    try {
      logger.info(`JoiHelper.existEmailCheck Request`);

      await check.validateAsync(req.body);
    } catch (e) {
      next(e);
    }
    next();
  },

  editInfoCheck: async (req, res, next) => {
    const requestUserId = req.params.userId;
    const { userId } = res.locals.user;
    const check = Joi.object().keys({
      requestUserId: Joi.string().required,
      email: Joi.string()
        .email()
        .required()
        .error(new BadRequestError('email 형식에 맞춰서 입력 바랍니다.')),

      name: Joi.string()
        .required()
        .regex(/^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]){2,15}$/)
        .error(new BadRequestError('이름 입력란을 다시 확인해주세요.')),

      password: Joi.string()
        .required()
        .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{8,20}$/)
        .error(
          new BadRequestError(
            '비밀번호는 영문 대/소문자, 숫자 각 1자리 이상 포함한 8~20자리 조합입니다.'
          )
        ),

      phoneNumber: Joi.string()
        .required()
        .regex(/^[0-9]{10,11}$/)
        .error(
          new BadRequestError('핸드폰 번호는 - 를 제외한 10~11 자리 입니다.')
        ),

      companyName: Joi.string()
        .required()
        .error(new BadRequestError('회사이름 입력란을 다시 확인해주세요.')),

      companyNumber: Joi.string()
        .required()
        .regex(/^[0-9]{4,11}$/)
        .error(new BadRequestError('회사 번호는 숫자만 입력이 가능합니다')),

      companyEmail: Joi.string()
        .email()
        .required()
        .error(
          new BadRequestError('회사 이메일을 이메일 형식에 맞게 기재 바랍니다.')
        ),
    });

    const requestUserIdSchema = Joi.number()
      .min(1)
      .required()
      .error(new BadRequestError('요청하신 회원 정보가 유효하지 않습니다.'));

    const userIdSchema = Joi.number()
      .valid(userId)
      .required()
      .error(
        new ForbiddenError(
          '요청하신 회원의 정보와 토큰의 정보가 일치하지 않습니다.'
        )
      );

    try {
      logger.info(`JoiHelper.editInfoCheck Request`);
      await requestUserIdSchema.validateAsync(requestUserId);
      await userIdSchema.validateAsync(requestUserId);
      await check.validateAsync(req.body);
    } catch (e) {
      next(e);
    }
    next();
  },

  userIdAndRequestIdCheck: async (req, res, next) => {
    const requestUserId = req.params.userId;
    const { userId } = res.locals.user;

    const requestUserIdSchema = Joi.number()
      .min(1)
      .required()
      .error(new BadRequestError('요청하신 회원 정보가 유효하지 않습니다.'));

    const userIdSchema = Joi.number()
      .valid(userId)
      .required()
      .error(
        new ForbiddenError(
          '요청하신 회원의 정보와 토큰의 정보가 일치하지 않습니다.'
        )
      );
    try {
      logger.info(`JoiHelper.userIdAndRequestIdCheck Request`);
      await requestUserIdSchema.validateAsync(requestUserId);
      await userIdSchema.validateAsync(requestUserId);
    } catch (e) {
      next(e);
    }
    next();
  },
};

module.exports = JoiHelper;
