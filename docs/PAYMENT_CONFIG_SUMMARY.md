# Payment Gateway Configuration Summary

## ✅ Configured Payment Methods

### 1. **VNPay** (Sandbox)
- Status: ✅ Ready for testing
- Credentials: Official Demo Account (DEMOV210)
- Test Cards: See `docs/VNPAY_TEST_GUIDE.md`

### 2. **MoMo** (Sandbox)  
- Status: ✅ Ready for testing
- Credentials: Official Test Account (MOMOBKUN20180529)
- Documentation: See `docs/MOMO_TEST_GUIDE.md`

### 3. **Cash on Delivery (COD)**
- Status: ✅ Working
- No configuration needed

---

## 🧪 Quick Test

### Test MoMo Payment

1. **Start the application**:
   ```bash
   docker-compose up -d
   ```

2. **Open frontend**: http://localhost:8080

3. **Place an order**:
   - Add products to cart
   - Go to checkout
   - Select **MoMo** payment
   - Click "Place Order"

4. **You should see**:
   - Redirect to MoMo payment page
   - Payment URL with QR code
   - Option to pay with MoMo wallet

5. **After payment**:
   - Success: Redirects to `http://localhost:8080/order-success.html`
   - Failed: Redirects to `http://localhost:8080/payment/failed`

---

## 🔍 Verify Configuration

```bash
# Check payment service is running
docker ps | grep payment-service

# Check MoMo configuration
docker exec payment-service env | grep MOMO

# Expected output:
MOMO_PARTNER_CODE=MOMOBKUN20180529
MOMO_ACCESS_KEY=klm05TvNBzhg7h7j
MOMO_SECRET_KEY=at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
MOMO_REDIRECT_URL=http://localhost:8080/order-success.html
MOMO_IPN_URL=http://localhost:3000/api/payments/momo/ipn

# Watch payment logs
docker logs payment-service -f
```

---

## 🐛 Common Issues & Solutions

### Issue: "Failed to create MoMo payment"

**Solution**: The service now generates unique orderIds automatically. Just try again.

### Issue: "Invalid signature"

**Solution**: Restart payment service
```bash
docker-compose restart payment-service
```

### Issue: Payment page not loading

**Solution**: Check if service is running
```bash
docker logs payment-service --tail 50
```

### Issue: Not redirected after payment

**Solution**: Verify URLs in `.env` files match your setup:
- Frontend: `http://localhost:8080`
- API Gateway: `http://localhost:3000`

---

## 📝 Payment Flow

```
User clicks "Place Order"
    ↓
Frontend → API Gateway → Payment Service
    ↓
Payment Service creates payment request
    ↓
Payment Service → MoMo/VNPay API
    ↓
Returns payment URL
    ↓
User redirected to payment page
    ↓
User completes payment
    ↓
Payment gateway → Callback URL
    ↓
Payment Service updates order status
    ↓
User redirected to success/failed page
```

---

## 🎯 Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create` | Create new payment |
| GET | `/api/payments/vnpay/callback` | VNPay return URL |
| GET | `/api/payments/momo/callback` | MoMo return URL |
| POST | `/api/payments/momo/ipn` | MoMo IPN notification |
| GET | `/api/payments/status/:order_id` | Check payment status |

---

## 📚 Documentation

- **VNPay Guide**: `/docs/VNPAY_TEST_GUIDE.md`
- **MoMo Guide**: `/docs/MOMO_TEST_GUIDE.md`
- **API Docs**: `/docs/api-docs.html`

---

**Last Updated**: December 3, 2025
