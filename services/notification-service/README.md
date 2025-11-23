# Notification Service

Multi-channel notification management service for the e-commerce platform. Handles email, SMS, push notifications, and in-app notifications with queue-based processing, template management, and campaign support.

## 🎯 Features

- **Multi-Channel Support**: Email, SMS, Push Notifications, In-App Notifications
- **Template Management**: Handlebars-based templates with dynamic variables
- **Queue System**: Bull queues with Redis for async processing and retry logic
- **Email Campaigns**: Marketing campaigns with segmentation and tracking
- **User Preferences**: Customizable notification preferences per user
- **Event-Based Triggers**: Automatic notifications based on system events
- **Analytics**: Delivery tracking, open rates, click rates

## 🏗️ Architecture

```
notification-service/
├── src/
│   ├── models/           # Database models
│   │   ├── NotificationTemplate.js
│   │   ├── Notification.js
│   │   ├── EmailCampaign.js
│   │   ├── UserPreference.js
│   │   └── NotificationEvent.js
│   ├── services/         # Business logic
│   │   ├── email.service.js
│   │   └── sms.service.js
│   ├── controllers/      # Request handlers
│   │   ├── notification.controller.js
│   │   ├── template.controller.js
│   │   ├── campaign.controller.js
│   │   └── preference.controller.js
│   ├── routes/          # API routes
│   │   ├── notification.routes.js
│   │   ├── template.routes.js
│   │   └── campaign.routes.js
│   ├── queues/          # Bull queue processors
│   │   └── index.js
│   ├── config/          # Configuration
│   │   └── database.js
│   └── index.js         # Entry point
├── .env.example
├── Dockerfile
└── package.json
```

## 📡 API Endpoints

### Notifications

#### Send Notification
```http
POST /api/notifications/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": 123,
  "recipient": "user@example.com",
  "channel": "email",
  "templateCode": "ORDER_CONFIRMATION",
  "variables": {
    "customerName": "John Doe",
    "orderNumber": "ORD-001",
    "totalAmount": "500000"
  }
}
```

#### Trigger Event-Based Notification
```http
POST /api/notifications/trigger-event
Authorization: Bearer <token>
Content-Type: application/json

{
  "eventType": "order.created",
  "userId": 123,
  "recipient": "user@example.com",
  "data": {
    "orderNumber": "ORD-001",
    "totalAmount": "500000"
  }
}
```

#### Get User Notifications
```http
GET /api/notifications/user/:userId?channel=email&status=sent&page=1&limit=20
Authorization: Bearer <token>
```

#### Mark Notification as Read
```http
PUT /api/notifications/:id/read
Authorization: Bearer <token>
```

#### Get Statistics
```http
GET /api/notifications/stats?startDate=2024-01-01&endDate=2024-12-31&channel=email
Authorization: Bearer <token>
```

### Templates (Admin)

#### Get All Templates
```http
GET /api/templates?channel=email&active=true
Authorization: Bearer <admin-token>
```

#### Create Template
```http
POST /api/templates
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Order Shipped",
  "code": "ORDER_SHIPPED",
  "channel": "email",
  "subject": "Your Order {{orderNumber}} Has Shipped!",
  "body": "<h2>Order Shipped</h2><p>Hi {{customerName}}, your order {{orderNumber}} is on the way!</p>",
  "variables": ["customerName", "orderNumber", "trackingNumber"]
}
```

#### Update Template
```http
PUT /api/templates/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "subject": "Updated Subject",
  "body": "<p>Updated template content</p>",
  "isActive": true
}
```

### Campaigns (Admin)

#### Create Campaign
```http
POST /api/campaigns
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Spring Sale 2024",
  "subject": "🌸 Spring Sale - Up to 50% Off!",
  "body": "<h1>Spring Sale</h1><p>Don't miss our biggest sale of the season!</p>",
  "templateId": 1,
  "segment": "verified_users",
  "scheduledAt": "2024-03-20T10:00:00Z"
}
```

#### Send Campaign
```http
POST /api/campaigns/:id/send
Authorization: Bearer <admin-token>
```

#### Track Campaign
```http
GET /api/campaigns/:id/track
Authorization: Bearer <admin-token>
```

### User Preferences

#### Get User Preferences
```http
GET /api/notifications/preferences/:userId
Authorization: Bearer <token>
```

#### Update Preferences
```http
PUT /api/notifications/preferences/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "emailEnabled": true,
  "smsEnabled": false,
  "marketingEmails": false,
  "orderUpdates": true,
  "promotions": false
}
```

## 🔧 Configuration

### Environment Variables

```env
# Server
PORT=3006
NODE_ENV=production

# Database
DB_HOST=mysql
DB_PORT=3306
DB_NAME=notification_db
DB_USER=root
DB_PASS=password

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# Application
APP_NAME=E-Commerce Platform
FRONTEND_URL=http://localhost:3000

# Service URLs
USER_SERVICE_URL=http://user-service:3001
```

### SMTP Setup (Gmail Example)

1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App Passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the generated password
3. Use the app password as `SMTP_PASS`

### Twilio Setup

1. Sign up at https://www.twilio.com
2. Get your Account SID and Auth Token from the dashboard
3. Purchase a phone number
4. Add credentials to `.env`

## 📧 Predefined Templates

### User Verification Email (`USER_VERIFICATION`)
**Variables**: `userName`, `verificationUrl`, `appName`
```html
<div style="font-family: Arial, sans-serif;">
  <h2>Welcome to {{appName}}!</h2>
  <p>Hi {{userName}},</p>
  <p>Please verify your email address by clicking the link below:</p>
  <a href="{{verificationUrl}}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
    Verify Email
  </a>
</div>
```

### Password Reset (`PASSWORD_RESET`)
**Variables**: `userName`, `resetUrl`
```html
<div style="font-family: Arial, sans-serif;">
  <h2>Password Reset Request</h2>
  <p>Hi {{userName}},</p>
  <p>Click the link below to reset your password:</p>
  <a href="{{resetUrl}}">Reset Password</a>
  <p>If you didn't request this, please ignore this email.</p>
</div>
```

### Order Confirmation (`ORDER_CONFIRMATION`)
**Variables**: `customerName`, `orderNumber`, `totalAmount`
```html
<div style="font-family: Arial, sans-serif;">
  <h2>Order Confirmed!</h2>
  <p>Hi {{customerName}},</p>
  <p>Your order {{orderNumber}} has been confirmed.</p>
  <p><strong>Total: {{totalAmount}} VND</strong></p>
  <p>Thank you for shopping with us!</p>
</div>
```

## 🔄 Queue Processing

The service uses Bull queues with Redis for reliable async processing:

### Email Queue
- **Concurrency**: 5 simultaneous jobs
- **Attempts**: 3 retries with exponential backoff
- **Delay**: 2 seconds between retries
- **Timeout**: 30 seconds per job

### SMS Queue
- **Concurrency**: 3 simultaneous jobs
- **Attempts**: 3 retries
- **Delay**: 2 seconds between retries
- **Timeout**: 20 seconds per job

### Job Flow
1. Notification request received
2. Job added to queue with status `pending`
3. Queue processor picks up job
4. Send via appropriate channel (email/SMS)
5. Update notification status (`sent` or `failed`)
6. Retry on failure (up to 3 times)
7. Store error message if all attempts fail

## 📊 Database Schema

### notification_templates
- `id` - Primary key
- `name` - Display name
- `code` - Unique identifier (e.g., ORDER_CONFIRMATION)
- `channel` - email | sms | push | in_app
- `subject` - Email subject or notification title
- `body` - Template content with Handlebars variables
- `variables` - JSON array of required variables
- `is_active` - Enable/disable template
- `created_at`, `updated_at`

### notifications
- `id` - Primary key
- `user_id` - User ID (nullable for guests)
- `recipient` - Email, phone, or user identifier
- `channel` - Notification channel
- `template_code` - Template used
- `subject` - Rendered subject
- `body` - Rendered content
- `status` - pending | sent | failed | read
- `error_message` - Error details if failed
- `sent_at`, `read_at` - Timestamps
- `metadata` - JSON for additional data
- `created_at`, `updated_at`

### email_campaigns
- `id` - Primary key
- `name` - Campaign name
- `subject`, `body` - Email content
- `template_id` - Optional template reference
- `segment` - Target audience
- `segment_filter` - Custom filter criteria
- `status` - draft | scheduled | sending | sent | cancelled
- `scheduled_at`, `sent_at`
- `total_recipients`, `sent_count`, `failed_count`
- `opened_count`, `clicked_count` - Analytics
- `created_at`, `updated_at`

### user_preferences
- `id` - Primary key
- `user_id` - User reference
- `email_enabled`, `sms_enabled`, `push_enabled` - Channel preferences
- `marketing_emails`, `order_updates`, `promotions`, `newsletter` - Type preferences
- `created_at`, `updated_at`

### notification_events
- `id` - Primary key
- `event_type` - Event identifier (e.g., user.registered)
- `template_code` - Template to use
- `channel` - Notification channel
- `is_active` - Enable/disable trigger
- `delay_minutes` - Delay before sending
- `priority` - low | medium | high | urgent
- `created_at`, `updated_at`

## 🔌 Integration Examples

### From User Service (Registration)
```javascript
const axios = require('axios');

// Send verification email
await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/api/notifications/send`, {
  userId: user.id,
  recipient: user.email,
  channel: 'email',
  templateCode: 'USER_VERIFICATION',
  variables: {
    userName: user.name,
    verificationUrl: `${process.env.FRONTEND_URL}/verify/${token}`,
    appName: process.env.APP_NAME
  }
});
```

### From Order Service (Order Created)
```javascript
// Trigger event-based notification
await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/api/notifications/trigger-event`, {
  eventType: 'order.created',
  userId: order.userId,
  recipient: order.customerEmail,
  data: {
    customerName: order.customerName,
    orderNumber: order.orderNumber,
    totalAmount: order.totalAmount
  }
});
```

### From Payment Service (SMS Notification)
```javascript
// Send SMS notification
await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/api/notifications/send`, {
  userId: payment.userId,
  recipient: user.phoneNumber,
  channel: 'sms',
  templateCode: 'PAYMENT_SUCCESS',
  variables: {
    amount: payment.amount,
    orderNumber: payment.orderNumber
  }
});
```

## 🧪 Testing

### Manual Testing
```bash
# Send test email
curl -X POST http://localhost:3006/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "recipient": "test@example.com",
    "channel": "email",
    "templateCode": "USER_VERIFICATION",
    "variables": {
      "userName": "Test User",
      "verificationUrl": "http://localhost:3000/verify/test-token",
      "appName": "Test App"
    }
  }'
```

### Queue Monitoring
```bash
# Check queue status
docker exec -it notification-service npm run queue:status
```

## 🚨 Error Handling

### Email Errors
- **SMTP Connection Failed**: Check SMTP credentials and firewall
- **Invalid Recipient**: Validate email format before sending
- **Rate Limit Exceeded**: Implement exponential backoff

### SMS Errors
- **Invalid Phone Number**: Use E.164 format (+country_code_phone)
- **Insufficient Credits**: Top up Twilio account
- **Service Unavailable**: Queue will retry automatically

### Queue Errors
- **Redis Connection Lost**: Service auto-reconnects
- **Job Timeout**: Increase timeout in queue config
- **Memory Issues**: Reduce concurrency or add more Redis memory

## 📈 Monitoring

### Health Check
```bash
curl http://localhost:3006/health
```

Response:
```json
{
  "status": "OK",
  "service": "Notification Service",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "redis": "connected",
  "queues": {
    "email": { "waiting": 0, "active": 2, "completed": 150, "failed": 3 },
    "sms": { "waiting": 0, "active": 1, "completed": 45, "failed": 0 }
  }
}
```

### Metrics to Monitor
- Queue depth (waiting jobs)
- Processing time per job
- Success/failure rates
- Email open rates
- SMS delivery rates
- Template usage statistics

## 🔐 Security

- All internal endpoints require authentication
- Admin endpoints require admin role verification
- Rate limiting applied to prevent abuse
- User preferences respected for all notifications
- PII data encrypted in database
- SMTP credentials stored as environment variables
- Twilio credentials secured

## 📝 Best Practices

1. **Template Design**: Use responsive HTML templates
2. **Variable Validation**: Always validate template variables
3. **Error Handling**: Log all failures for debugging
4. **Queue Management**: Monitor queue depth regularly
5. **User Preferences**: Always check before sending
6. **Testing**: Test templates with real data before campaigns
7. **Scheduling**: Schedule campaigns during optimal times
8. **Analytics**: Track and analyze campaign performance

## 🆘 Troubleshooting

### Emails Not Sending
1. Check SMTP credentials in `.env`
2. Verify SMTP port is not blocked by firewall
3. Check queue status: `docker logs notification-service`
4. Verify template exists and is active

### SMS Not Delivering
1. Verify Twilio credentials
2. Check phone number format (E.164)
3. Confirm Twilio account has sufficient credits
4. Check Twilio console for error messages

### Queue Processing Slow
1. Increase concurrency in queue config
2. Add more Redis memory
3. Scale notification service horizontally
4. Optimize template rendering

### High Failure Rate
1. Check error logs in `notifications` table
2. Verify recipient addresses are valid
3. Review retry configuration
4. Check external service status (SMTP/Twilio)

## 🔄 Maintenance

### Database Cleanup
```sql
-- Delete old notifications (older than 90 days)
DELETE FROM notifications 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY)
AND status IN ('sent', 'read', 'failed');

-- Clean up old campaigns
DELETE FROM email_campaigns 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 180 DAY)
AND status = 'sent';
```

### Queue Cleanup
```bash
# Clear failed jobs
docker exec -it notification-service npm run queue:clean:failed

# Clear completed jobs older than 1 day
docker exec -it notification-service npm run queue:clean:completed
```

## 📚 Additional Resources

- [Bull Queue Documentation](https://github.com/OptimalBits/bull)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Twilio Node.js SDK](https://www.twilio.com/docs/libraries/node)
- [Handlebars Documentation](https://handlebarsjs.com/)

## 📧 Support

For issues or questions:
- Check logs: `docker logs notification-service`
- Review this documentation
- Contact the development team
