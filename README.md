# E-Commerce Microservices Platform

A complete Node.js microservices architecture for e-commerce, migrated from PHP MVC monolithic application.

## 🏗️ Architecture

This project follows Service-Oriented Architecture (SOA) principles with the following components:

### Frontend
- **React SPA** (Port 8080) - Modern single-page application with Vite, React Router, Tailwind CSS

### Backend Microservices
- **API Gateway** (Port 3000) - Entry point for all client requests
- **User Service** (Port 3001) - Authentication, user management, addresses
- **Product Service** (Port 3002) - Products, categories, SKUs, inventory
- **Cart Service** (Port 3003) - Shopping cart and wishlist
- **Order Service** (Port 3004) - Order processing and management
- **Payment Service** (Port 3005) - Payment processing (VNPay, MoMo, COD)
- **Notification Service** (Port 3006) - Multi-channel notifications (Email, SMS, Push, In-App)

## 📦 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client
- **React Query** - Server state management

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MySQL 8.0 (Database per service pattern)
- **Cache**: Redis 7
- **ORM**: Sequelize
- **Authentication**: JWT
- **Containerization**: Docker & Docker Compose
- **Payment Gateways**: VNPay, MoMo, Cash on Delivery
- **Queue System**: Bull (Redis-backed job queues)
- **Email**: Nodemailer with SMTP
- **SMS**: Twilio integration
- **Template Engine**: Handlebars

## 🚀 Quick Start

### Prerequisites

- Docker Desktop installed
- Node.js 18+ (for local development)
- Git

### 1. Clone Repository

```bash
git clone https://github.com/taiphung143/CK_SOA.git
cd CK_SOA
```

### 2. Environment Setup

Copy environment files for each service:

```bash
# Root environment
cp .env.example .env

# Service environments
cp services/user-service/.env.example services/user-service/.env
cp services/product-service/.env.example services/product-service/.env
cp services/cart-service/.env.example services/cart-service/.env
cp services/order-service/.env.example services/order-service/.env
cp services/payment-service/.env.example services/payment-service/.env
cp services/notification-service/.env.example services/notification-service/.env
cp api-gateway/.env.example api-gateway/.env
```

### 3. Configure Environment Variables

Edit `.env` files with your configuration:

**Important**: Update the following in respective `.env` files:
- JWT_SECRET in user-service
- SMTP credentials in notification-service (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
- Twilio credentials in notification-service (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER)
- VNPay credentials in payment-service
- MoMo credentials in payment-service

### 4. Start with Docker Compose

```bash
docker-compose up -d
```

This will start:
- Frontend (Port 8080)
- API Gateway (Port 3000)
- All 6 microservices (Ports 3001-3006)
- MySQL (Port 3306)
- Redis (Port 6379)

### 5. Initialize Databases

The database initialization script will run automatically on first start. It creates:
- user_db
- product_db
- cart_db
- order_db
- payment_db
- notification_db

### 6. Verify Installation

Check all services are running:

```bash
docker-compose ps
```

Test health endpoints:

```bash
# Check frontend
http://localhost:8080

# Check API health
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health
curl http://localhost:3005/health
curl http://localhost:3006/health
```

## 📡 API Endpoints

All requests go through the API Gateway at `http://localhost:3000`

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### User Management
- `GET /api/users/profile` - Get user profile (Auth required)
- `PUT /api/users/profile` - Update profile (Auth required)
- `POST /api/users/change-password` - Change password (Auth required)

### Addresses
- `GET /api/addresses` - Get all addresses (Auth required)
- `POST /api/addresses` - Add new address (Auth required)
- `PUT /api/addresses/:id` - Update address (Auth required)
- `DELETE /api/addresses/:id` - Delete address (Auth required)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/slug/:slug` - Get product by slug
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Admin only)

### Cart
- `GET /api/cart` - Get user's cart (Auth required)
- `POST /api/cart/items` - Add item to cart (Auth required)
- `PUT /api/cart/items/:item_id` - Update cart item (Auth required)
- `DELETE /api/cart/items/:item_id` - Remove from cart (Auth required)
- `DELETE /api/cart/clear` - Clear cart (Auth required)

### Wishlist
- `GET /api/wishlist` - Get wishlist (Auth required)
- `POST /api/wishlist` - Add to wishlist (Auth required)
- `DELETE /api/wishlist/:id` - Remove from wishlist (Auth required)

### Orders
- `POST /api/orders` - Create order (Auth required)
- `GET /api/orders` - Get user's orders (Auth required)
- `GET /api/orders/:id` - Get order details (Auth required)
- `PUT /api/orders/:id/cancel` - Cancel order (Auth required)

### Payments
- `POST /api/payments/create` - Create payment
- `GET /api/payments/status/:order_id` - Get payment status
- `GET /api/payments/vnpay/callback` - VNPay callback
- `POST /api/payments/momo/ipn` - MoMo IPN callback

### Notifications
- `POST /api/notifications/send` - Send notification (Internal/Auth required)
- `POST /api/notifications/trigger-event` - Trigger event-based notification
- `GET /api/notifications/user/:userId` - Get user notifications (Auth required)
- `PUT /api/notifications/:id/read` - Mark as read (Auth required)
- `GET /api/notifications/stats` - Get notification statistics

### Notification Templates (Admin)
- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get template by ID
- `POST /api/templates` - Create template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template

### Email Campaigns (Admin)
- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get campaign details
- `POST /api/campaigns` - Create campaign
- `POST /api/campaigns/:id/send` - Send campaign
- `GET /api/campaigns/:id/track` - Track campaign performance

## 🔧 Development

### Running Locally (Without Docker)

1. Install dependencies for each service:

```bash
cd api-gateway && npm install
cd ../services/user-service && npm install
cd ../product-service && npm install
cd ../cart-service && npm install
cd ../order-service && npm install
cd ../payment-service && npm install
cd ../notification-service && npm install
```

2. Start MySQL and Redis locally

3. Update `.env` files with local database connections:
```
DB_HOST=localhost
REDIS_HOST=localhost
```

4. Run each service in separate terminals:

```bash
# Terminal 1
cd api-gateway && npm run dev

# Terminal 2
cd services/user-service && npm run dev

# Terminal 3
cd services/product-service && npm run dev

# Terminal 4
cd services/cart-service && npm run dev

# Terminal 5
cd services/order-service && npm run dev

# Terminal 6
cd services/payment-service && npm run dev

# Terminal 7
cd services/notification-service && npm run dev

# Terminal 4
cd services/cart-service && npm run dev

# Terminal 5
cd services/order-service && npm run dev

# Terminal 6
cd services/payment-service && npm run dev
```

### Database Migrations

To modify database schema:

1. Edit the SQL file: `database/init.sql`
2. Drop existing databases or use migration tools
3. Restart services to apply changes

## 🧪 Testing

Example API calls using curl:

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get products
curl http://localhost:3000/api/products

# Add to cart (with auth token)
curl -X POST http://localhost:3000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "product_id": 1,
    "sku_id": 1,
    "quantity": 2
  }'
```

## 📊 Database Schema

### User Service (user_db)
- users
- user_tokens
- addresses

### Product Service (product_db)
- categories
- products
- product_skus
- product_images

### Cart Service (cart_db)
- cart
- cart_item
- wishlist

### Order Service (order_db)
- orders
- order_item

### Payment Service (payment_db)
- payment_details

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Helmet.js for security headers
- Rate limiting on API Gateway
- CORS configuration
- Input validation with Joi
- SQL injection prevention with Sequelize ORM

## 📝 Environment Variables Reference

### API Gateway
```
PORT=3000
USER_SERVICE_URL=http://user-service:3001
PRODUCT_SERVICE_URL=http://product-service:3002
CART_SERVICE_URL=http://cart-service:3003
ORDER_SERVICE_URL=http://order-service:3004
PAYMENT_SERVICE_URL=http://payment-service:3005
```

### User Service
```
PORT=3001
DB_NAME=user_db
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Payment Service (Important!)
```
# VNPay
VNPAY_TMN_CODE=your_tmn_code
VNPAY_SECRET_KEY=your_secret_key

# MoMo
MOMO_PARTNER_CODE=your_partner_code
MOMO_ACCESS_KEY=your_access_key
MOMO_SECRET_KEY=your_secret_key
```

## 🐛 Troubleshooting

### Services not starting
```bash
docker-compose logs -f service-name
```

### Database connection errors
- Ensure MySQL container is running: `docker ps`
- Check database credentials in `.env` files
- Verify databases are created: `docker exec -it mysql mysql -uroot -p`

### Port conflicts
- Change port mappings in `docker-compose.yml`
- Update service URLs in `.env` files accordingly

## 📈 Performance Optimization

- Redis caching for frequently accessed data
- Database indexing on foreign keys
- Connection pooling in Sequelize
- Efficient SQL queries with proper joins
- API response pagination

## 🚢 Deployment

### Docker Production Build

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Checklist
- [ ] Update all JWT_SECRET values
- [ ] Configure production database credentials
- [ ] Set up production Redis instance
- [ ] Configure SMTP for production emails
- [ ] Add real VNPay production credentials
- [ ] Add real MoMo production credentials
- [ ] Set FRONTEND_URL to production domain
- [ ] Enable HTTPS/SSL
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up monitoring and logging

## 📚 Project Structure

```
final_project_web/
├── api-gateway/           # API Gateway service
│   ├── src/
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
├── services/
│   ├── user-service/      # User authentication & management
│   ├── product-service/   # Product catalog
│   ├── cart-service/      # Shopping cart & wishlist
│   ├── order-service/     # Order processing
│   └── payment-service/   # Payment gateway integration
├── database/
│   └── init.sql           # Database initialization
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Tai Phung**
- GitHub: [@taiphung143](https://github.com/taiphung143)

## 🙏 Acknowledgments

- Migrated from PHP MVC monolithic architecture
- Built with Node.js microservices best practices
- Payment integration with VNPay and MoMo Vietnam

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Note**: This is a complete production-ready microservices platform. Ensure all environment variables are properly configured before deployment.
