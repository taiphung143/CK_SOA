const { PaymentDetail } = require('../models');
const vnpayService = require('../services/vnpay.service');
const momoService = require('../services/momo.service');
const axios = require('axios');

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://order-service:3004';

class PaymentController {
  async createPayment(req, res, next) {
    try {
      const { order_id, amount, payment_method } = req.body;
      console.log('Payment creation request:', { order_id, amount, payment_method });

      // Normalize payment method to handle case variations
      const normalizedPaymentMethod = payment_method.toLowerCase();

      // Use actual client IP like in working PHP implementation
      const ipAddr = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                    req.headers['x-real-ip'] ||
                    req.connection.remoteAddress?.replace('::ffff:', '') ||
                    '127.0.0.1';

      let paymentUrl = null;
      let transactionId = null;
      let paymentData = {};

      // Generate payment details based on method first
      if (normalizedPaymentMethod === 'vnpay') {
        const result = vnpayService.createPaymentUrl(
          order_id,
          amount,
          `Payment for Order #${order_id}`,
          ipAddr
        );
        paymentUrl = result.paymentUrl;
        transactionId = result.txnRef;
        paymentData = { txnRef: result.txnRef };

      } else if (normalizedPaymentMethod === 'momo') {
        const result = await momoService.createPayment(
          order_id,
          amount,
          `Payment for Order #${order_id}`
        );
        paymentUrl = result.payUrl;
        transactionId = result.requestId;
        paymentData = { requestId: result.requestId, qrCodeUrl: result.qrCodeUrl };

      } else if (normalizedPaymentMethod === 'cod') {
        // Cash on Delivery - no payment URL needed
        transactionId = `COD_${order_id}_${Date.now()}`;
      } else {
        console.log('Invalid payment method:', payment_method);
        return res.status(400).json({
          success: false,
          message: 'Invalid payment method'
        });
      }

      // Check if completed payment already exists
      const existingCompletedPayment = await PaymentDetail.findOne({
        where: {
          order_id,
          status: 'completed'
        }
      });

      if (existingCompletedPayment) {
        console.log('Completed payment already exists for order_id:', order_id);
        return res.status(400).json({
          success: false,
          message: 'Payment already completed for this order'
        });
      }

      // Check if payment with same method already exists and is pending
      const existingPendingPayment = await PaymentDetail.findOne({
        where: {
          order_id,
          method: normalizedPaymentMethod,
          status: 'pending'
        }
      });

      if (existingPendingPayment) {
        console.log('Updating existing pending payment for order_id:', order_id);
        // Regenerate payment URL for the update
        let updatedPaymentUrl = paymentUrl;
        let updatedTransactionId = transactionId;
        let updatedPaymentData = paymentData;
        
        if (normalizedPaymentMethod === 'vnpay') {
          // Always regenerate a new payment URL for VNPay
          const vnpayResult = vnpayService.createPaymentUrl(
            order_id,
            amount,
            `Payment for Order #${order_id}`,
            ipAddr
          );
          updatedPaymentUrl = vnpayResult.paymentUrl;
          updatedTransactionId = vnpayResult.txnRef;
          updatedPaymentData = { txnRef: vnpayResult.txnRef };
        } else if (normalizedPaymentMethod === 'momo') {
          // Regenerate MoMo payment with new unique ID
          const momoResult = await momoService.createPayment(
            order_id,
            amount,
            `Payment for Order #${order_id}`
          );
          updatedPaymentUrl = momoResult.payUrl;
          updatedTransactionId = momoResult.requestId;
          updatedPaymentData = { requestId: momoResult.requestId, qrCodeUrl: momoResult.qrCodeUrl };
        }
        
        await existingPendingPayment.update({
          transaction_id: updatedTransactionId,
          amount,
          payment_data: updatedPaymentData,
          updated_at: new Date()
        });

        return res.status(200).json({
          success: true,
          message: 'Payment updated successfully',
          data: {
            payment_id: existingPendingPayment.id,
            payment_url: updatedPaymentUrl,
            payment_method,
            status: existingPendingPayment.status
          }
        });
      }

      // Create payment record
      const payment = await PaymentDetail.create({
        order_id,
        method: normalizedPaymentMethod,
        transaction_id: transactionId,
        amount,
        payment_data: paymentData,
        status: normalizedPaymentMethod === 'cod' ? 'completed' : 'pending'
      });

      // Update order payment status if COD
      if (normalizedPaymentMethod === 'cod') {
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
          method: 'vnpay'
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

        return res.redirect(`${process.env.FRONTEND_URL}/order-success.html?order_id=${orderId}&vnp_ResponseCode=00`);
      } else {
        // Payment failed
        await payment.update({ status: 'failed' });
        await axios.put(
          `${ORDER_SERVICE_URL}/api/orders/${orderId}/payment-status`,
          { payment_status: 'failed' }
        );

        return res.redirect(`${process.env.FRONTEND_URL}/payment-failed.html?order_id=${orderId}&message=VNPay+payment+failed`);
      }
    } catch (error) {
      next(error);
    }
  }

  async vnpayIpn(req, res, next) {
    try {
      console.log('VNPay IPN request received:', req.method, req.headers['content-type']);
      console.log('Request body:', req.body);

      // For testing, just return success immediately
      return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });

      const vnpParams = req.body;

      // Verify signature
      const isValid = vnpayService.verifyCallback(vnpParams);
      if (!isValid) {
        return res.status(400).json({ RspCode: '97', Message: 'Invalid signature' });
      }

      const orderId = vnpParams.vnp_TxnRef.split('_')[0];
      const responseCode = vnpParams.vnp_ResponseCode;
      const transactionStatus = vnpParams.vnp_TransactionStatus;

      const payment = await PaymentDetail.findOne({
        where: {
          order_id: orderId,
          method: 'vnpay'
        }
      });

      if (!payment) {
        return res.status(400).json({ RspCode: '01', Message: 'Payment not found' });
      }

      if (responseCode === '00' && transactionStatus === '00') {
        // Payment successful
        if (payment.status !== 'completed') {
          await payment.update({
            status: 'completed',
            paid_at: new Date(),
            payment_data: { ...payment.payment_data, vnpParams }
          });

          // Update order payment status asynchronously
          axios.put(
            `${ORDER_SERVICE_URL}/api/orders/${orderId}/payment-status`,
            { payment_status: 'paid' }
          ).catch(error => {
            console.error('Failed to update order status:', error.message);
          });
        }

        return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
      } else {
        // Payment failed
        if (payment.status !== 'failed') {
          await payment.update({ status: 'failed' });
          // Update order payment status asynchronously
          axios.put(
            `${ORDER_SERVICE_URL}/api/orders/${orderId}/payment-status`,
            { payment_status: 'failed' }
          ).catch(error => {
            console.error('Failed to update order status:', error.message);
          });
        }

        return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
      }
    } catch (error) {
      console.error('VNPay IPN error:', error);
      return res.status(500).json({ RspCode: '99', Message: 'Internal server error' });
    }
  }

  async momoCallback(req, res, next) {
    try {
      // MoMo sends data via both GET (redirect) and POST (IPN)
      const momoData = req.method === 'GET' ? req.query : req.body;
      
      console.log('MoMo Callback received:', req.method, momoData);

      // Verify signature
      const isValid = momoService.verifySignature(momoData);
      if (!isValid) {
        console.error('❌ MoMo Invalid signature');
        if (req.method === 'GET') {
          return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?reason=invalid_signature`);
        }
        return res.status(400).json({
          success: false,
          message: 'Invalid signature'
        });
      }

      const momoOrderId = momoData.orderId;
      // Extract original order_id from MoMo's unique orderId (format: "123_1234567890")
      const orderId = momoOrderId.split('_')[0];
      const resultCode = parseInt(momoData.resultCode);

      const payment = await PaymentDetail.findOne({
        where: { 
          order_id: orderId,
          method: 'momo'
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

        // Redirect to success page for GET requests
        if (req.method === 'GET') {
          return res.redirect(`${process.env.FRONTEND_URL}/order-success.html?order_id=${orderId}`);
        }
      } else {
        // Payment failed or cancelled
        console.log(`❌ MoMo Payment Failed - Order: ${orderId}, ResultCode: ${resultCode}, Message: ${momoData.message}`);
        
        await payment.update({ 
          status: 'failed',
          payment_data: { ...payment.payment_data, momoData }
        });

        try {
          // Update order payment status
          const updateResponse = await axios.put(
            `${ORDER_SERVICE_URL}/api/orders/${orderId}/payment-status`,
            { payment_status: 'failed' },
            { timeout: 5000 }
          );
          console.log(`✅ Order ${orderId} payment status updated to failed`);
        } catch (orderError) {
          console.error(`❌ Failed to update order status for ${orderId}:`, orderError.message);
        }

        // Redirect to failed page for GET requests
        if (req.method === 'GET') {
          const message = momoData.message || 'Payment failed';
          return res.redirect(`${process.env.FRONTEND_URL}/payment-failed.html?order_id=${orderId}&message=${encodeURIComponent(message)}`);
        }
      }

      res.json({
        success: true,
        message: 'Callback processed'
      });
    } catch (error) {
      console.error('❌ MoMo Callback Error:', error);
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
