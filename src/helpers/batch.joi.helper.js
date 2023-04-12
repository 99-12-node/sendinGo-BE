const Joi = require('joi');
const { logger } = require('../middlewares/logger');
const { BadRequestError } = require('../exceptions/errors');

const batchJoiHelper = {
  // 대량 클라이언트 기존 그룹 추가 Body
  createClientGroupBulkBody: async (req, res, next) => {
    const schema = Joi.object().keys({
      clientIds: Joi.array()
        .items(Joi.number())
        .required()
        .error(new BadRequestError('올바른 고객ID를 입력해주세요.')),
    });
    try {
      logger.info(`batchJoiHelper.createClientGroupBulkBody Request`);
      await schema.validateAsync(req.body);
    } catch (e) {
      next(e);
    }
    next();
  },
  // 대량 클라이언트 기존 그룹 추가 Params
  createClientGroupBulkParams: async (req, res, next) => {
    const schema = Joi.object().keys({
      groupId: Joi.number()
        .required()
        .error(new BadRequestError('올바른 그룹ID를 입력해주세요.')),
    });
    try {
      logger.info(`batchJoiHelper.createClientGroupBulkParams Request`);
      await schema.validateAsync(req.params);
    } catch (e) {
      next(e);
    }
    next();
  },

  // 대량 클라이언트 신규 그룹 추가 Body
  createClientBulkNewGroupBody: async (req, res, next) => {
    const schema = Joi.object().keys({
      clientIds: Joi.array()
        .items(Joi.number())
        .required()
        .error(new BadRequestError('올바른 고객ID를 입력해주세요.')),
      groupName: Joi.string()
        .required()
        .error(new BadRequestError('올바른 그룹명을 입력해주세요.')),
      groupDescription: Joi.string().optional(),
    });
    try {
      logger.info(`batchJoiHelper.createClientBulkNewGroupBody Request`);
      await schema.validateAsync(req.body);
    } catch (e) {
      next(e);
    }
    next();
  },
};

module.exports = batchJoiHelper;
