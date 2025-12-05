# VNPay Testing Guide

## ✅ Issue Fixed

The error "Website này chưa được phê duyệt" (This website has not been approved) has been resolved by switching to VNPay's official demo credentials.

## 🔑 Demo Credentials

Your system now uses VNPay's pre-approved demo account:

```
Terminal ID (TMN Code): DEMOV210
Secret Key: RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ
Environment: Sandbox
```

## 💳 Test Credit Cards

Use these test cards provided by VNPay for payment testing:

### Domestic Cards (Thẻ nội địa)

| Bank | Card Number | Card Holder | Issue Date | OTP |
|------|-------------|-------------|------------|-----|
| NCB | 9704198526191432198 | NGUYEN VAN A | 07/15 | 123456 |
| Vietcombank | 9704 0000 0000 0018 | NGUYEN VAN A | 03/07 | OTP |
| Techcombank | 9704 0000 0000 0026 | NGUYEN VAN A | 03/07 | OTP |
| BIDV | 9704 0000 0000 0034 | NGUYEN VAN A | 03/07 | OTP |
| Agribank | 9704 0000 0000 0042 | NGUYEN VAN A | 03/07 | OTP |

### International Cards (Thẻ quốc tế)

| Type | Card Number | Card Holder | Expiry | CVV |
|------|-------------|-------------|---------|-----|
| Visa | 4242 4242 4242 4242 | NGUYEN VAN A | 12/25 | 123 |
| Mastercard | 5200 0000 0000 0056 | NGUYEN VAN A | 12/25 | 123 |

## 🧪 Testing Steps

1. **Place an Order**
   - Add products to cart
   - Go to checkout
   - Select VNPay payment method
   - Complete order

2. **Payment Process**
   - You'll be redirected to VNPay sandbox page
   - Select a bank from the list
   - Enter test card details above
   - Complete the payment

3. **Success Scenarios**
   - Use NCB card with number: `9704198526191432198`
   - OTP code: `123456`
   - You'll be redirected back to order success page

## 🔄 Return URLs

The system is configured with:

```
Return URL: http://localhost:8080/order-success.html
IPN URL: http://localhost:3000/api/payments/vnpay/ipn
```

## 📝 Notes

- **Sandbox Environment**: All transactions are simulated, no real money involved
- **Testing Only**: These credentials are for development/testing purposes
- **Production**: For production, you must:
  1. Register with VNPay at: https://vnpay.vn
  2. Complete merchant verification
  3. Get approved production credentials
  4. Update `.env` files with production credentials

## 🚀 Production Setup

When ready for production:

1. **Register with VNPay**
   - Website: https://vnpay.vn
   - Contact: support@vnpay.vn
   - Process: 3-7 business days

2. **Update Configuration**
   ```bash
   # Update .env files
   VNP_TMN_CODE=YOUR_PRODUCTION_TMN_CODE
   VNP_HASH_SECRET=YOUR_PRODUCTION_SECRET
   VNP_URL=https://pay.vnpay.vn/vpcpay.html
   ```

3. **Update Return URLs**
   - Must be your real domain (HTTPS required)
   - Example: https://yourdomain.com/payment/success

## 🔧 Troubleshooting

### Payment fails immediately
- Check that payment-service is running: `docker ps`
- Restart if needed: `docker-compose restart payment-service`

### Card not accepted
- Use exact test card numbers from the table above
- Make sure to enter OTP: `123456` for NCB cards

### Not redirected after payment
- Check browser console for errors
- Verify return URL in `.env` matches your frontend URL

## 📞 Support

- VNPay Documentation: https://sandbox.vnpayment.vn/apis/docs/
- VNPay Support: support@vnpay.vn
- Phone: 1900 55 55 77
