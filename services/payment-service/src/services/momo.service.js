const crypto = require('crypto');
const axios = require('axios');

class MoMoService {
  constructor() {
    this.partnerCode = process.env.MOMO_PARTNER_CODE;
    this.accessKey = process.env.MOMO_ACCESS_KEY;
    this.secretKey = process.env.MOMO_SECRET_KEY;
    this.endpoint = process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create';
    this.redirectUrl = process.env.MOMO_REDIRECT_URL || 'http://localhost:3000/payment/momo/callback';
    this.ipnUrl = process.env.MOMO_IPN_URL || 'http://localhost:3005/api/payments/momo/ipn';
  }

  async createPayment(orderId, amount, orderInfo) {
    const requestId = `${orderId}_${Date.now()}`;
    const requestType = 'captureWallet';
    const extraData = '';

    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${this.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${this.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode: this.partnerCode,
      accessKey: this.accessKey,
      requestId,
      amount: Math.round(amount),
      orderId: orderId.toString(),
      orderInfo,
      redirectUrl: this.redirectUrl,
      ipnUrl: this.ipnUrl,
      requestType,
      extraData,
      lang: 'vi',
      signature
    };

    try {
      const response = await axios.post(this.endpoint, requestBody, {
        headers: { 'Content-Type': 'application/json' }
      });

      return {
        payUrl: response.data.payUrl,
        requestId,
        qrCodeUrl: response.data.qrCodeUrl
      };
    } catch (error) {
      console.error('MoMo API Error:', error);
      throw new Error('Failed to create MoMo payment');
    }
  }

  verifySignature(data) {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    } = data;

    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    const generatedSignature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    return signature === generatedSignature;
  }
}

module.exports = new MoMoService();
