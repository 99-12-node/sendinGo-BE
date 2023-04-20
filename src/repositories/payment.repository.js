const { logger } = require('../middlewares/logger');
const { Payments } = require('../db/models');
const { Op } = require('sequelize');

module.exports = class PaymentRepository {
  constructor() {}

  // 결제 내역 생성
  createPayment = async ({ userId, companyId, ...paymentData }) => {
    logger.info(`PaymentRepository.createPayment Request`);
    const newPayment = await Payments.create({
      userId,
      companyId,
      ...paymentData,
    });
    return newPayment;
  };

  // userId 로 결제 내역 조회
  getPaymentsByUser = async ({ userId, companyId }) => {
    logger.info(`PaymentRepository.getPaymentsByUser Request`);
    const payments = await Payments.findAll({
      where: {
        [Op.and]: [{ userId }, { companyId }],
      },
      attributes: ['paymentId', 'paidName', 'paidAmount', 'paidAt', 'status'],
    });
    return payments;
  };
};
