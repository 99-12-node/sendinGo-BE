const Joi = require('joi');
const { logger } = require('../middlewares/logger');
const { BadRequestError } = require('../exceptions/errors');

const talkJoiHelper = {
  // talkContents Request Body
  contentReqBodyCheck: async (req, res, next) => {
    const content = Joi.object().keys({
      groupId: Joi.number()
        .required()
        .error(new BadRequestError('올바른 그룹ID를 입력해주세요.')),
      clientId: Joi.number()
        .required()
        .error(new BadRequestError('올바른 고객ID를 입력해주세요.')),
      talkTemplateId: Joi.number()
        .required()
        .error(new BadRequestError('올바른 템플릿ID를 입력해주세요.')),
      talkContentId: Joi.number()
        .required()
        .error(new BadRequestError('올바른 전송내용ID를 입력해주세요.')),
      organizationName: Joi.string().optional(),
      orderNumber: Joi.string().optional(),
      region: Joi.string().optional(),
      regionDetail: Joi.string().optional(),
      deliveryDate: Joi.string().optional(),
      paymentPrice: Joi.number().optional(),
      deliveryCompany: Joi.string().optional(),
      deliveryTime: Joi.string().optional(),
      deliveryNumber: Joi.string().optional(),
      customerName: Joi.string().optional(),
      useLink: Joi.string().optional(),
    });
    const schema = Joi.object().keys({
      data: Joi.array()
        .items(content)
        .required()
        .error(new BadRequestError('입력값을 확인해주세요.')),
    });
    try {
      logger.info(`talkJoiHelper.contentReqBodyCheck Request`);
      await schema.validateAsync(req.body);
    } catch (e) {
      next(e);
    }
    next();
  },

  // client, content select
  clientContentReq: async (req, res, next) => {
    const schema = Joi.object().keys({
      groupId: Joi.number()
        .required()
        .error(new BadRequestError('올바르지 않은 요청입니다.')),
    });
    try {
      logger.info(`talkJoiHelper.clientContentReq Request`);
      await schema.validateAsync(req.body);
    } catch (e) {
      next(e);
    }
    next();
  },

  // templateId Request Params
  templateIdParamsCheck: async (req, res, next) => {
    const schema = Joi.object().keys({
      talkTemplateId: Joi.number()
        .required()
        .error(new BadRequestError('올바른 템플릿 Id를 입력해주세요.')),
    });
    try {
      logger.info(`talkJoiHelper.templateIdParamsCheck Request`);
      await schema.validateAsync(req.params);
    } catch (e) {
      next(e);
    }
    next();
  },

  // 알림톡 전송 body
  talkSendBody: async (req, res, next) => {
    const sendReq = Joi.object()
      .keys({
        talkContentId: Joi.number().required(),
        clientId: Joi.number().required(),
        talkTemplateId: Joi.number().required(),
        groupId: Joi.number().required(),
      })
      .error(new BadRequestError('올바른 Id인지 확인해주세요.'));
    const schema = Joi.object().keys({
      data: Joi.array()
        .items(sendReq)
        .required()
        .error(new BadRequestError('입력값을 확인해주세요.')),
    });
    try {
      logger.info(`talkJoiHelper.talkSendBody Request`);
      await schema.validateAsync(req.body);
    } catch (e) {
      next(e);
    }
    next();
  },

  // 전송 결과 리스트 조회 Parmas
  sendResultParams: async (req, res, next) => {
    const schema = Joi.object().keys({
      groupId: Joi.number()
        .optional()
        .error(new BadRequestError('올바른 그룹 Id를 입력해주세요.')),
      startdate: Joi.string()
        .optional()
        .error(new BadRequestError('올바른 시작일자를 입력해주세요.')),
      enddate: Joi.string()
        .optional()
        .error(new BadRequestError('올바른 종료일자를 입력해주세요.')),
    });
    try {
      logger.info(`talkJoiHelper.sendResultParams Request`);
      await schema.validateAsync(req.query);
    } catch (e) {
      next(e);
    }
    next();
  },

  // 전송 결과 상세 조회 Parmas
  sendResultDetailParams: async (req, res, next) => {
    const schema = Joi.object().keys({
      talkSendId: Joi.number()
        .required()
        .error(new BadRequestError('입력값을 확인해주세요.')),
    });
    try {
      logger.info(`talkJoiHelper.sendResultDetailParams Request`);
      await schema.validateAsync(req.params);
    } catch (e) {
      next(e);
    }
    next();
  },
};

module.exports = talkJoiHelper;
