const crypto = require('crypto');
const qs = require('qs');

class VNPayService {
  constructor() {
    this.tmnCode = 'M83AU6J1'; // sandbox cấp cho bạn
    this.hashSecret = 'HFYYZLP07MHOYFIJ0ABH7AEAMDDMRHIW';
    this.vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  }

  createPaymentUrl(orderId, amount) {
    const date = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const createDate = `${date.getFullYear()}${pad(date.getMonth()+1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;

    let params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.tmnCode,
      vnp_Amount: amount * 100,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId.toString(),
      vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
      vnp_OrderType: 'other',
      vnp_ReturnUrl: 'http://localhost:3000/order-success.html',
      vnp_IpAddr: '127.0.0.1',
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
    return { paymentUrl };
  }
}

module.exports = new VNPayService();
