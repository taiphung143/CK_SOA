# MoMo Sandbox Testing Guide

## ✅ Configuration Complete

Your system is now configured with MoMo's official test credentials for sandbox testing.

## 🔑 Test Credentials

```
Partner Code: MOMOBKUN20180529
Access Key: klm05TvNBzhg7h7j
Secret Key: at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa
Environment: Test/Sandbox
```

## 📱 Testing with MoMo App

### Option 1: Using MoMo Sandbox App

1. **Download MoMo Sandbox App**
   - Not available on App Store/Play Store
   - Request from MoMo support: support@momo.vn
   - Or use web payment interface

### Option 2: Web Payment (Recommended for Testing)

1. **Place Order**
   - Add products to cart
   - Proceed to checkout
   - Select **MoMo** as payment method
   - Click "Place Order"

2. **Payment Page**
   - You'll be redirected to MoMo payment page
   - Choose payment method:
     - **QR Code**: Scan with MoMo app (if available)
     - **MoMo Wallet**: Login with test account
     - **ATM/Credit Card**: Use test card

3. **Complete Payment**
   - Follow on-screen instructions
   - You'll be redirected back to success page

## 🧪 Test Scenarios

### Success Payment Flow

1. Select MoMo payment
2. Complete payment process
3. Should redirect to: `http://localhost:8080/order-success.html?order_id=XXX`
4. Order status updated to "paid"

### Failed Payment Flow

1. Select MoMo payment
2. Cancel or fail payment
3. Should redirect to: `http://localhost:8080/payment/failed?order_id=XXX`
4. Order status remains "pending"

## 🔗 API Endpoints

### Create Payment
```
POST http://localhost:3000/api/payments/create
Content-Type: application/json

{
  "order_id": 123,
  "amount": 100000,
  "payment_method": "momo"
}

Response:
{
  "success": true,
  "data": {
    "payment_id": 456,
    "payment_url": "https://test-payment.momo.vn/...",
    "payment_method": "momo",
    "status": "pending"
  }
}
```

### Callback URLs

- **Return URL** (User redirect): `http://localhost:8080/order-success.html`
- **IPN URL** (Server notification): `http://localhost:3000/api/payments/momo/ipn`

## 📝 MoMo Request/Response Flow

### 1. Create Payment Request

```javascript
{
  partnerCode: "MOMOBKUN20180529",
  accessKey: "klm05TvNBzhg7h7j",
  requestId: "123_1234567890",
  amount: 100000,
  orderId: "123",
  orderInfo: "Payment for Order #123",
  redirectUrl: "http://localhost:8080/order-success.html",
  ipnUrl: "http://localhost:3000/api/payments/momo/ipn",
  requestType: "captureWallet",
  extraData: "",
  lang: "vi",
  signature: "..."
}
```

### 2. MoMo Response

```javascript
{
  partnerCode: "MOMOBKUN20180529",
  requestId: "123_1234567890",
  orderId: "123",
  amount: 100000,
  responseTime: 1234567890,
  message: "Successful.",
  resultCode: 0,
  payUrl: "https://test-payment.momo.vn/gw_payment/...",
  deeplink: "momoapps://...",
  qrCodeUrl: "https://test-payment.momo.vn/...",
  applink: "momo://..."
}
```

### 3. Result Codes

| Code | Description |
|------|-------------|
| 0 | Success |
| 9000 | Transaction is being processed |
| 8000 | Transaction is rejected |
| 1000 | Transaction failed |
| 1001 | Transaction timeout |
| 1003 | Transaction cancelled by user |
| 1004 | Transaction failed due to exceeding transaction amount limit |
| 1005 | Invalid address |
| 1006 | Transaction failed due to exceeding daily limit |
| 1007 | Balance not enough |
| 4001 | Invalid amount |
| 4100 | Invalid signature |

## 🔧 Troubleshooting

### Error: "Invalid signature"

**Cause**: Request signature doesn't match

**Solution**:
```bash
# Verify environment variables are loaded
docker exec payment-service env | grep MOMO

# Expected output:
MOMO_PARTNER_CODE=MOMOBKUN20180529
MOMO_ACCESS_KEY=klm05TvNBzhg7h7j
MOMO_SECRET_KEY=at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa
```

### Error: "Partner not found"

**Cause**: Wrong partner code

**Solution**:
- Verify partner code is exactly: `MOMOBKUN20180529`
- Check for extra spaces or special characters

### Payment URL not working

**Cause**: MoMo endpoint or credentials changed

**Solution**:
```bash
# Restart payment service
docker-compose restart payment-service

# Check logs
docker logs payment-service --tail 50
```

### Not redirected after payment

**Cause**: Incorrect return URL

**Solution**:
- Verify `MOMO_REDIRECT_URL` in `.env`
- Should be: `http://localhost:8080/order-success.html`
- Must match your frontend URL

## 🌐 Production Setup

When ready for production:

### 1. Register with MoMo Business

- Website: https://business.momo.vn
- Email: support@momo.vn
- Phone: 1900 5454 41
- Requirements:
  - Business registration
  - Tax ID
  - Bank account
  - Processing time: 3-5 business days

### 2. Get Production Credentials

After approval, you'll receive:
- Production Partner Code
- Production Access Key
- Production Secret Key

### 3. Update Configuration

```bash
# Update .env files
MOMO_PARTNER_CODE=YOUR_PRODUCTION_PARTNER_CODE
MOMO_ACCESS_KEY=YOUR_PRODUCTION_ACCESS_KEY
MOMO_SECRET_KEY=YOUR_PRODUCTION_SECRET_KEY
MOMO_ENDPOINT=https://payment.momo.vn/v2/gateway/api/create
MOMO_REDIRECT_URL=https://yourdomain.com/order-success.html
MOMO_IPN_URL=https://yourdomain.com/api/payments/momo/ipn
```

### 4. Important Notes

- Production URLs must be HTTPS
- Domain must be registered with MoMo
- IPN URL must be publicly accessible
- MoMo will verify your domain

## 📞 Support

- **MoMo Developer Portal**: https://developers.momo.vn
- **Email**: support@momo.vn
- **Hotline**: 1900 5454 41
- **Technical Documentation**: https://developers.momo.vn/v3/docs/payment/api/wallet

## 🔍 Testing Checklist

- [x] MoMo credentials configured
- [x] Payment service restarted
- [ ] Create test order
- [ ] Select MoMo payment
- [ ] Complete payment
- [ ] Verify redirect to success page
- [ ] Check order status updated
- [ ] Test failed payment scenario
- [ ] Verify IPN callback received

## 💡 Tips

1. **Use ngrok for local testing**:
   ```bash
   ngrok http 3000
   # Update MOMO_IPN_URL with ngrok URL
   ```

2. **Check payment logs**:
   ```bash
   docker logs payment-service -f
   ```

3. **Test both success and cancel flows**

4. **Verify IPN is received even if user closes browser**

---

**Last Updated**: December 3, 2025
