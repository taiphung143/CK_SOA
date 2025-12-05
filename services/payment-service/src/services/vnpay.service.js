const crypto = require('crypto');
const qs = require('qs');

class VNPayService {
  constructor() {
    // VNPay Official Demo Credentials (Pre-approved for testing)
    this.tmnCode = process.env.VNP_TMNCODE || 'RKYAHCG9';
    this.hashSecret = process.env.VNP_HASHSECRET || 'O7EDQHMSRFFNBF5F6IX6FI65UTHHUP7V';
    this.vnpUrl = process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    this.returnUrl = process.env.VNP_RETURN_URL || 'http://localhost:8080/order-success.html';
  }

  createPaymentUrl(orderId, amount, description = '', ipAddr = '127.0.0.1') {
    const date = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const createDate = `${date.getFullYear()}${pad(date.getMonth()+1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
    
    // Generate unique transaction reference
    const txnRef = `${orderId}_${Date.now()}`;

    let params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.tmnCode,
      vnp_Amount: amount * 100,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: description || `Thanh toan don hang ${orderId}`,
      vnp_OrderType: 'other',
      vnp_ReturnUrl: this.returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
      vnp_Locale: 'vn'
    };

    // BẮT BUỘC: sort alphabet
    params = Object.keys(params).sort().reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {});

    // BẮT BUỘC: sử dụng qs.stringify chuẩn RFC3986
    const signData = qs.stringify(params, { encode: true });

    // BẮT BUỘC: secret + signData
    const hmac = crypto
      .createHmac('sha512', this.hashSecret)
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');

    params.vnp_SecureHash = hmac;

    const paymentUrl = `${this.vnpUrl}?${qs.stringify(params, { encode: true })}`;
    return { 
      paymentUrl,
      txnRef 
    };
  }

  verifyCallback(vnpParams) {
    const secureHash = vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    // Sort params alphabetically
    const sortedParams = Object.keys(vnpParams).sort().reduce((acc, key) => {
      acc[key] = vnpParams[key];
      return acc;
    }, {});

    const signData = qs.stringify(sortedParams, { encode: true });
    const hmac = crypto
      .createHmac('sha512', this.hashSecret)
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');

    return hmac === secureHash;
  }
}

module.exports = new VNPayService();
