const Joi = require('joi');
const { logger } = require('../middlewares/logger');
const { BadRequestError } = require('../exceptions/errors');

const JoiHelper = {
  //Client
  clientCheck: async (req, res, next) => {
    const check = Joi.object().keys({
      clientName: Joi.string()
        .required()
        .regex(/^([a-zA-Z0-9ㄱ-ㅎ가-힣])+$/)
        .error(new BadRequestError('올바른 고객명을 입력해주세요.')),

      contact: Joi.string()
        .required()
        .regex(/^[0-9]{10,11}$/)
        .error(new BadRequestError('올바른 휴대폰 번호를 입력해주세요.')),

      clientEmail: Joi.string()
        .email()
        .required()
        .error(new BadRequestError('이메일 형식에 맞춰서 입력바랍니다.')),
    });
    try {
      logger.info(`JoiHelper.clientCheck Request`);
      await check.validateAsync(req.body);
    } catch (e) {
      next(e);
    }
    next();
  },

  //clientId
  clientId: async (req, res, next) => {
    const check = Joi.object().keys({
      clientId: Joi.number()
        .required()
        .error(new BadRequestError('clientId는 숫자입니다.')),
    });
    try {
      logger.info(`JoiHelper.clientId Request`);
      await check.validateAsync(req.params);
    } catch (e) {
      next(e);
    }
    next();
  },

  //index
  checkIndex: async (req, res, next) => {
    const check = Joi.object().keys({
      index: Joi.number()
        .integer()
        .required()
        .positive()
        .error(new BadRequestError('index는 1부터 시작하는 양의 정수입니다.')),

      groupId: Joi.number()
        .integer()
        .optional()
        .error(new BadRequestError('groupId는 숫자입니다.')),

      keyword: Joi.string()
        .optional()
        .trim()
        .regex(/^\S+$/)
        .error(new BadRequestError('검색 내용을 찾을 수 없습니다.')),
    });

    try {
      logger.info(`JoiHelper.checkIndex Request`);
      await check.validateAsync(req.query);
    } catch (e) {
      next(e);
    }
    next();
  },

  //Group
  groupCheck: async (req, res, next) => {
    const check = Joi.object().keys({
      groupName: Joi.string()
        .required()
        .trim()
        .regex(/^([a-zA-Z0-9ㄱ-ㅎ가-힣 ])*$/)
        .error(new BadRequestError('그룹명을 입력해주세요.')),

      groupDescription: Joi.string().allow('').allow(null).required(),
    });
    try {
      logger.info(`JoiHelper.groupCheck Request`);
      await check.validateAsync(req.body);
    } catch (e) {
      next(e);
    }
    next();
  },

  //groupId
  groupId: async (req, res, next) => {
    const check = Joi.object().keys({
      groupId: Joi.number()
        .required()
        .error(new BadRequestError('groupId는 숫자입니다.')),
    });
    try {
      logger.info(`JoiHelper.groupId Request`);
      await check.validateAsync(req.params);
    } catch (e) {
      next(e);
    }
    next();
  },
  clientGroupCheck: async (req, res, next) => {
    const check = Joi.object().keys({
      clientId: Joi.number()
        .required()
        .error(new BadRequestError('올바른 clientId를 입력해주세요.')),

      groupId: Joi.number()
        .required()
        .error(new BadRequestError('올바른 groupId를 입력해주세요.')),
    });
    try {
      logger.info(`JoiHelper.clientGroupCheck Request`);
      await check.validateAsync(req.params);
    } catch (e) {
      next(e);
    }
    next();
  },

  groupIdCheck: async (req, res, next) => {
    const check = Joi.object().keys({
      clientId: Joi.number()
        .required()
        .error(new BadRequestError('올바른 clientId를 입력해주세요.')),

      existGroupId: Joi.number()
        .required()
        .error(new BadRequestError('올바른 existGroupId를 입력해주세요.')),

      newGroupId: Joi.number()
        .required()
        .error(new BadRequestError('올바른 newGroupId를 입력해주세요.')),
    });
    try {
      logger.info(`JoiHelper.groupIdCheck Request`);
      await check.validateAsync(req.params);
    } catch (e) {
      next(e);
    }
    next();
  },
};

module.exports = JoiHelper;
