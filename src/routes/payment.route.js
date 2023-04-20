const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const PaymentController = require('../controllers/payment.controller');
const paymentController = new PaymentController();

const { controllerLogger } = require('../middlewares/logger.middleware.js');
router.use(controllerLogger);

router.post('/', authMiddleware, paymentController.createPayment);

router.get('/:userId', authMiddleware, paymentController.getPaymentsByUser);

module.exports = router;
