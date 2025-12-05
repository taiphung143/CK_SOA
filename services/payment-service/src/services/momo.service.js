const crypto = require('crypto');
const axios = require('axios');

class MoMoService {
  constructor() {
    this.partnerCode = process.env.MOMO_PARTNER_CODE || 'MOMOBKUN20180529';
    this.accessKey = process.env.MOMO_ACCESS_KEY || 'klm05TvNBzhg7h7j';
    this.secretKey = process.env.MOMO_SECRET_KEY || 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';
    this.endpoint = process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create';
    // Redirect should go to backend callback, not directly to frontend
    this.redirectUrl = process.env.MOMO_REDIRECT_URL || 'http://localhost:3000/api/payments/momo/callback';
    this.ipnUrl = process.env.MOMO_IPN_URL || 'http://localhost:3000/api/payments/momo/ipn';
    
    console.log('🔧 MoMo Service Initialized:', {
      partnerCode: this.partnerCode,
      endpoint: this.endpoint,
      redirectUrl: this.redirectUrl
    });
  }

  async createPayment(orderId, amount, orderInfo) {
    // MoMo requires unique orderId for each request
    const timestamp = Date.now();
    const requestId = `${orderId}_${timestamp}`;
    const uniqueOrderId = `${orderId}_${timestamp}`;
    const requestType = 'captureWallet';
    const extraData = '';

    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${this.ipnUrl}&orderId=${uniqueOrderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${this.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode: this.partnerCode,
      accessKey: this.accessKey,
      requestId,
      amount: Math.round(amount),
      orderId: uniqueOrderId,
      orderInfo,
      redirectUrl: this.redirectUrl,
      ipnUrl: this.ipnUrl,
      requestType,
      extraData,
      lang: 'vi',
      signature
    };

    try {
      console.log('📤 MoMo Request:', {
        endpoint: this.endpoint,
        orderId,
        amount,
        requestId
      });

      const response = await axios.post(this.endpoint, requestBody, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('📥 MoMo Response:', {
        resultCode: response.data.resultCode,
        message: response.data.message
      });

      if (response.data.resultCode !== 0) {
        throw new Error(`MoMo Error: ${response.data.message}`);
      }

      return {
        payUrl: response.data.payUrl,
        requestId,
        qrCodeUrl: response.data.qrCodeUrl,
        deeplink: response.data.deeplink
      };
    } catch (error) {
      console.error('❌ MoMo API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create MoMo payment');
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
