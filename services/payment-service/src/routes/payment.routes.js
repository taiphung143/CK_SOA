const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.post('/create', paymentController.createPayment);
router.get('/vnpay/callback', paymentController.vnpayCallback);
router.post('/vnpay/ipn', paymentController.vnpayIpn);
router.post('/momo/ipn', paymentController.momoCallback);
router.get('/status/:order_id', paymentController.getPaymentStatus);

module.exports = router;
