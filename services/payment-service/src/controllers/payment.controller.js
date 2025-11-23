const { PaymentDetail } = require('../models');
const vnpayService = require('../services/vnpay.service');
const momoService = require('../services/momo.service');
const axios = require('axios');

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://order-service:3004';

class PaymentController {
  async createPayment(req, res, next) {
    try {
      const { order_id, amount, payment_method } = req.body;
      const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1';

      // Check if payment already exists
      const existingPayment = await PaymentDetail.findOne({ where: { order_id } });
      if (existingPayment) {
        return res.status(400).json({
          success: false,
          message: 'Payment already exists for this order'
        });
      }

      let paymentUrl = null;
      let transactionId = null;
      let paymentData = {};

      if (payment_method === 'VNPay') {
        const result = vnpayService.createPaymentUrl(
          order_id,
          amount,
          `Payment for Order #${order_id}`,
          ipAddr
        );
        paymentUrl = result.paymentUrl;
        transactionId = result.txnRef;
        paymentData = { txnRef: result.txnRef };

      } else if (payment_method === 'MoMo') {
        const result = await momoService.createPayment(
          order_id,
          amount,
          `Payment for Order #${order_id}`
        );
        paymentUrl = result.payUrl;
        transactionId = result.requestId;
        paymentData = { requestId: result.requestId, qrCodeUrl: result.qrCodeUrl };

      } else if (payment_method === 'COD') {
        // Cash on Delivery - no payment URL needed
        transactionId = `COD_${order_id}_${Date.now()}`;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment method'
        });
      }

      // Create payment record
      const payment = await PaymentDetail.create({
        order_id,
        payment_method,
        transaction_id: transactionId,
        amount,
        payment_data: paymentData,
        status: payment_method === 'COD' ? 'completed' : 'pending'
      });

      // Update order payment status if COD
      if (payment_method === 'COD') {
        await axios.put(
          `${ORDER_SERVICE_URL}/api/orders/${order_id}/payment-status`,
          { payment_status: 'paid' }
        );
      }

      res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: {
          payment_id: payment.id,
          payment_url: paymentUrl,
          payment_method,
          status: payment.status
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async vnpayCallback(req, res, next) {
    try {
      const vnpParams = req.query;

      // Verify signature
      const isValid = vnpayService.verifyCallback(vnpParams);
      if (!isValid) {
        return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?reason=invalid_signature`);
      }

      const orderId = vnpParams.vnp_TxnRef.split('_')[0];
      const responseCode = vnpParams.vnp_ResponseCode;

      const payment = await PaymentDetail.findOne({
        where: { 
          order_id: orderId,
          payment_method: 'VNPay'
        }
      });

      if (!payment) {
        return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?reason=payment_not_found`);
      }

      if (responseCode === '00') {
        // Payment successful
        await payment.update({
          status: 'completed',
          paid_at: new Date(),
          payment_data: { ...payment.payment_data, vnpParams }
        });

        // Update order payment status
        await axios.put(
          `${ORDER_SERVICE_URL}/api/orders/${orderId}/payment-status`,
          { payment_status: 'paid' }
        );

        return res.redirect(`${process.env.FRONTEND_URL}/order-success?order_id=${orderId}`);
      } else {
        // Payment failed
        await payment.update({ status: 'failed' });
        await axios.put(
          `${ORDER_SERVICE_URL}/api/orders/${orderId}/payment-status`,
          { payment_status: 'failed' }
        );

        return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?order_id=${orderId}`);
      }
    } catch (error) {
      next(error);
    }
  }

  async momoCallback(req, res, next) {
    try {
      const momoData = req.body;

      // Verify signature
      const isValid = momoService.verifySignature(momoData);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid signature'
        });
      }

      const orderId = momoData.orderId;
      const resultCode = momoData.resultCode;

      const payment = await PaymentDetail.findOne({
        where: { 
          order_id: orderId,
          payment_method: 'MoMo'
        }
      });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      if (resultCode === 0) {
        // Payment successful
        await payment.update({
          status: 'completed',
          paid_at: new Date(),
          payment_data: { ...payment.payment_data, momoData }
        });

        await axios.put(
          `${ORDER_SERVICE_URL}/api/orders/${orderId}/payment-status`,
          { payment_status: 'paid' }
        );
      } else {
        // Payment failed
        await payment.update({ status: 'failed' });
        await axios.put(
          `${ORDER_SERVICE_URL}/api/orders/${orderId}/payment-status`,
          { payment_status: 'failed' }
        );
      }

      res.json({
        success: true,
        message: 'Callback processed'
      });
    } catch (error) {
      next(error);
    }
  }

  async getPaymentStatus(req, res, next) {
    try {
      const { order_id } = req.params;

      const payment = await PaymentDetail.findOne({
        where: { order_id }
      });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      res.json({
        success: true,
        data: {
          order_id: payment.order_id,
          payment_method: payment.payment_method,
          amount: payment.amount,
          status: payment.status,
          transaction_id: payment.transaction_id,
          paid_at: payment.paid_at
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();
