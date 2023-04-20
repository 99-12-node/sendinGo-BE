const { ForbiddenError } = require('../exceptions/errors');
const { logger } = require('../middlewares/logger');
const PaymentService = require('../services/payment.service');

module.exports = class PaymentController {
  constructor() {
    this.paymentService = new PaymentService();
  }

  // 결제 내역 생성
  createPayment = async (req, res, next) => {
    logger.info(`PaymentController.createPayment Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const { name, ...paymentData } = req.body;

    try {
      const result = await this.paymentService.createPayment({
        userId,
        companyId,
        ...paymentData,
        paidName: name,
      });
      if (!result) {
        return res.status(400).json({ message: '결제에 실패하였습니다.' });
      }
      return res.status(200).json({ message: '결제에 성공하였습니다.' });
    } catch (error) {
      next(error);
    }
  };

  // userId 로 결제 내역 조회
  getPaymentsByUser = async (req, res, next) => {
    logger.info(`PaymentController.getPaymentsByUser Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const paramsUserId = req.params.userId;

    try {
      if (userId !== parseInt(paramsUserId))
        throw new ForbiddenError('권한이 없습니다.');

      const result = await this.paymentService.getPaymentsByUser({
        userId,
        companyId,
      });
      return res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  };
};
