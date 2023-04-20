const { logger } = require('../middlewares/logger');
const { BadRequestError } = require('../exceptions/errors');
const PaymentRepository = require('../repositories/payment.repository');

module.exports = class PaymentService {
  constructor() {
    this.paymentRepository = new PaymentRepository();
  }
  // 결제 내역 생성
  createPayment = async ({ userId, companyId, ...paymentData }) => {
    logger.info(`PaymentService.createPayment Request`);

    const newPayment = await this.paymentRepository.createPayment({
      userId,
      companyId,
      ...paymentData,
    });
    if (!newPayment) {
      throw new new BadRequestError('결제 내역 생성에 실패하였습니다.')();
    }

    return newPayment;
  };

  // userId 로 결제 내역 조회
  getPaymentsByUser = async ({ userId, companyId }) => {
    logger.info(`PaymentService.getPaymentsByUser Request`);

    const paymentList = await this.paymentRepository.getPaymentsByUser({
      userId,
      companyId,
    });
    return paymentList;
  };
};
