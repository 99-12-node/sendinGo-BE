const Joi = require('joi');
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  Conflict,
} = require('../exceptions//errors');

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
      await check.validateAsync(req.body);
    } catch (e) {
      next(e);
    }
    next();
  },
};

module.exports = JoiHelper;
