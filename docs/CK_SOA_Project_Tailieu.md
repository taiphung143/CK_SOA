# Tài Liệu Dự Án CK_SOA

**Tiêu đề:** Kiến trúc dịch vụ microservices cho hệ thống E‑Commerce (CK_SOA)

**Ngôn ngữ:** Tiếng Việt

**Mục tiêu tài liệu:**
- Trình bày tổng quan dự án, kiến trúc kỹ thuật, chi tiết từng microservice, cơ sở dữ liệu, luồng nghiệp vụ, triển khai, bảo mật, kiểm thử và vận hành.
- Cung cấp tài liệu tham khảo đầy đủ để một kỹ sư phần mềm hoặc đội DevOps có thể hiểu, cài đặt, vận hành và mở rộng hệ thống.

---

**Mục lục (chi tiết):**
1. Lời nói đầu
2. Tổng quan dự án
3. Kiến trúc hệ thống
4. Thiết kế và mô-đun chi tiết
   4.1. API Gateway
   4.2. User Service
   4.3. Product Service
   4.4. Cart Service
   4.5. Order Service
   4.6. Payment Service
   4.7. Notification Service
   4.8. Frontend (Static)
5. Luồng nghiệp vụ chính (Use Cases)
6. Giao diện API chi tiết và ví dụ
7. Cơ sở dữ liệu và mô hình dữ liệu
8. Triển khai, Docker & môi trường
9. Bảo mật, quản trị và kiểm toán
10. Kiểm thử, CI/CD và quality gates
11. Vận hành, giám sát và backup
12. Lộ trình phát triển, scale và mở rộng
13. Phụ lục: file cấu hình, scripts, migration, checklist
14. Tài liệu tham khảo và glossary

---

## 1. Lời nói đầu

Tài liệu này trình bày kiến trúc, thiết kế và hướng dẫn triển khai cho dự án CK_SOA — một nền tảng thương mại điện tử được xây dựng theo kiến trúc microservices. Mục tiêu chính của dự án là tạo nền tảng thương mại điện tử có khả năng mở rộng, dễ bảo trì và tách biệt trách nhiệm theo từng dịch vụ.

Tài liệu hướng tới các đối tượng:
- Kỹ sư backend/frontend: hiểu cách các dịch vụ hoạt động và tích hợp
- DevOps: triển khai, cấu hình và vận hành môi trường
- Tester/QA: kiểm thử API, tích hợp và performance
- Quản lý sản phẩm: nắm các luồng nghiệp vụ chính

Mỗi chương bao gồm mô tả chi tiết, ví dụ thực tế, lưu ý triển khai và các best-practice liên quan.

---

## 2. Tổng quan dự án

2.1. Mục đích
- Xây dựng hệ thống thương mại điện tử với các khả năng cơ bản: quản lý sản phẩm, giỏ hàng, đơn hàng, thanh toán và thông báo.
- Tái kiến trúc monolith thành microservices để dễ mở rộng, isolate lỗi và tối ưu tài nguyên.

2.2. Yêu cầu chính
- Hệ thống phải hỗ trợ nhiều tài khoản người dùng, xử lý giỏ hàng cho người dùng đăng nhập/khách.
- Hỗ trợ biến thể sản phẩm (SKU), quản lý tồn kho và giảm giá.
- Tích hợp VNPay/MoMo và phương thức COD cho thanh toán.
- Gửi thông báo email/SMS khi tạo đơn/hủy đơn.

2.3. Công nghệ chính
- Backend: Node.js + Express
- ORM: Sequelize (MySQL)
- Cache/Queue: Redis + Bull
- Frontend: tĩnh (HTML/CSS/JS) hiện có; có thể nâng cấp SPA (React/Vue)
- Containerization: Docker + Docker Compose
- Authentication: JWT

2.4. Dịch vụ chính
- `api-gateway`, `user-service`, `product-service`, `cart-service`, `order-service`, `payment-service`, `notification-service`, `frontend`.

---

## 3. Kiến trúc hệ thống

3.1. Mô hình tổng quan

Client (Browser / Mobile) -> Frontend -> API Gateway -> Microservices -> Databases

- API Gateway chịu trách nhiệm cho authentication, routing, rate limit và aggregation.
- Mỗi microservice có DB riêng (1 DB/service). Data được truy vấn/ghép nối qua API call khi cần.

3.2. Lợi ích của cách tiếp cận
- Isolate failures: lỗi ở 1 service không làm đứng cả hệ thống
- Scale độc lập: scale service nào cần tăng tài nguyên
- Tổ chức đội dễ hơn: mỗi team có thể sở hữu 1-2 services

3.3. Hạn chế và trade-offs
- Phức tạp hơn khi debug (distributed tracing cần thiết)
- Overhead của giao tiếp mạng giữa services
- Yêu cầu orchestration và monitoring tốt hơn

3.4. Giao tiếp giữa services
- Giao tiếp chính: HTTP REST (synchronous) cho các luồng yêu cầu trực tiếp
- Giao tiếp không đồng bộ (event-driven) bằng Redis/Bull hoặc Kafka để xử lý công việc nền (notifications, webhooks)

3.5. Sơ đồ kiến trúc (ASCII)

    +-----------+          +----------------+        +--------------+
    |  Browser  | --HTTP->|   Frontend     | --API->| API Gateway  |
    +-----------+          +----------------+        +------+-------+
                                                   /   |   |   |   \
                                                  /    |   |   |    \
                                      +----------+     |   |   |     +----------+
                                      | user-svc |     |   |   |     | product- |
                                      +----------+     |   |   |     | service  |
                                                      |   |   |     +----------+
                                                      |   |   |
                                                      |   |   +-> cart-service
                                                      |   +----> order-service
                                                      +-------> payment-service

Databases: MySQL (per-service), Redis for cache & queue

---

## 4. Thiết kế và mô-đun chi tiết

Phần này mô tả chi tiết từng service: mục tiêu, cấu trúc tệp, endpoints chính, luồng xử lý, và ví dụ request/response.

### 4.1. API Gateway

Mục tiêu chính:
- Rào chắn authentication: kiểm tra JWT token trước khi proxy request tới services.
- Aggregation: khi cần, gateway có thể gọi nhiều services và gom kết quả trả về cho client (ví dụ: trang dashboard, giỏ hàng tóm tắt).
- Rate-limiting và bảo vệ DDoS cơ bản.

Các middleware điển hình:
- `authMiddleware` — validate JWT, attach `req.user`.
- `errorHandler` — chuẩn hóa lỗi trả về client.
- `logger` — ghi request/response thời gian thực.

Endpoints mẫu tại gateway (proxy):
- `/api/auth/*` -> `user-service`
- `/api/products/*` -> `product-service`
- `/api/cart/*` -> `cart-service`

Ví dụ cấu hình (Express):

```javascript
// Proxy example (simplified)
app.use('/api/products', createProxyMiddleware({ target: PRODUCT_SERVICE_URL, changeOrigin: true }));
```

---

### 4.2. User Service

Mục tiêu: quản lý tài khoản, đăng ký, đăng nhập, profile, địa chỉ.

Thư mục chính:
- `src/controllers` — controller (auth, profile)
- `src/models` — sequelize models (User, Address, UserToken)
- `src/routes` — routes

Endpoints chính:
- `POST /api/auth/register` — đăng ký
- `POST /api/auth/login` — đăng nhập (trả JWT)
- `GET /api/users/profile` — lấy profile (Auth)

Luồng đăng ký (ví dụ):
1. Client gửi `POST /api/auth/register` với email, username, password.
2. Service validate input, hash password (bcrypt), lưu `users`.
3. Gửi email verify token thông qua `notification-service` hoặc SMTP trực tiếp.

Security notes:
- Password strength validation
- Rate limit API đăng nhập
- Store refresh tokens nếu triển khai

---

### 4.3. Product Service

Mục tiêu: quản lý danh mục, sản phẩm, SKU và kho.

Model chính:
- `products` (id, name, description, image_thumbnail, base_price, discount_percent)
- `product_skus` (id, product_id, sku, price, stock, brand_name)

Endpoints:
- `GET /api/products` — list, filter, pagination
- `GET /api/products/:id` — chi tiết sản phẩm, kèm SKUs
- `GET /api/products/sku/:skuId` — lấy thông tin SKU (dùng bởi cart-service)

Inventory flow:
- Khi order được tạo, `order-service` yêu cầu `product-service` giảm stock (synchronous) hoặc dùng reservation pattern.

---

### 4.4. Cart Service

Mục tiêu: lưu trữ giỏ hàng tạm thời của người dùng, hỗ trợ CRUD items.

Thiết kế DB:
- `cart` (id, user_id, status, created_at)
- `cart_item` (id, cart_id, product_sku_id, quantity, price, original_price, has_discount)

Luồng enrich data:
- Khi trả cart cho client, cart-service gọi `product-service` theo `product_sku_id` để lấy `product_name`, `image_thumbnail`, `brand_name` và `price` (nếu cần cập nhật giá).

APIs:
- `GET /api/cart` — lấy cart hiện tại
- `POST /api/cart/items` — thêm item
- `PUT /api/cart/items/:item_id` — cập nhật số lượng
- `DELETE /api/cart/items/:item_id` — xóa item

Edge cases:
- SKU hết hàng khi thêm -> trả lỗi
- Giá thay đổi giữa thời điểm add và checkout -> áp dụng business rule (lock price or warn user)

---

### 4.5. Order Service

Luồng chính tạo đơn:
1. Client gửi yêu cầu checkout kèm payment method.
2. Order service xác nhận tình trạng cart (gọi cart-service), kiểm tra tồn kho (product-service) và tính toán tổng.
3. Tạo bản ghi trong `orders`, `order_item`.
4. Gọi `payment-service` để tạo giao dịch nếu cần (VNPay/MoMo).
5. Khi thanh toán xác nhận, cập nhật trạng thái, gọi `notification-service` gửi email/SMS.

APIs:
- `POST /api/orders` — tạo đơn
- `GET /api/orders/:id` — lấy chi tiết

---

### 4.6. Payment Service

Chức năng:
- Tạo giao dịch VNPay/MoMo, xây dựng URL redirect, xử lý callback/IPN, cập nhật trạng thái giao dịch.

Security:
- Lưu secret keys trong biến môi trường, không commit.
- Validate signatures từ VNPay/MoMo.

---

### 4.7. Notification Service

Chức năng:
- Quản lý templates email/SMS
- Thực thi job gửi email/SMS (Bull + Redis)
- Lưu lịch sử thông báo

Pattern:
- Sử dụng job queue để tránh blocking request chính. Ví dụ: khi tạo đơn, gọi API `notification-service/trigger-event` để push job.

---

### 4.8. Frontend (Static)

Hiện tại frontend là phần tĩnh chứa HTML/CSS/JS. Để cải thiện trải nghiệm, cân nhắc chuyển sang SPA (React/Vue) dùng Vite hoặc Next.js.

---

## 5. Luồng nghiệp vụ chính (Use Cases)

Mục này mở rộng từng use-case thành luồng chi tiết, kịch bản lỗi, và các API gọi cần thiết. Dưới đây là ví dụ chi tiết cho 4 use-case quan trọng.

### 5.1. Đăng ký và xác thực email

Actors: Guest user

Flow:
1. User gửi `POST /api/auth/register` (email, username, password).
2. user-service validate input, tạo record `users` với `is_verified=false`.
3. Tạo token verify trong `user_tokens` và gửi email chứa link `GET /api/auth/verify-email/:token` (qua `notification-service`).
4. Người dùng click link -> user-service set `is_verified=true`.

Edge cases:
- Email đã tồn tại -> trả 409
- Token hết hạn -> cho phép gửi lại link

### 5.2. Thêm sản phẩm vào giỏ

Actors: Authenticated user

Flow:
1. Client gọi `POST /api/cart/items` với `sku_id` và `quantity` kèm JWT.
2. Cart service kiểm tra tồn kho bằng cách gọi `product-service` nếu cần.
3. Nếu available, lưu `cart_item` với `product_sku_id` và `price` hiện tại.

Error handling:
- Nếu SKU không tồn tại hoặc hết hàng -> trả 400 với message rõ ràng

### 5.3. Checkout và thanh toán

Actors: Authenticated user

Flow:
1. Client gọi `POST /api/orders` với `cart_id` và `payment_method`.
2. Order service lấy cart, validate items, tính tổng.
3. Gọi `payment-service` để tạo giao dịch cho VNPay/MoMo.
4. Redirect user tới cổng thanh toán hoặc xử lý mã QR (Cho MoMo).
5. Payment gateway callback -> payment-service xác nhận và notify order-service.
6. order-service cập nhật trạng thái và gửi thông báo qua notification-service.

Race conditions to consider:
- Stock double-booking: dùng DB transaction hoặc reservation pattern.

### 5.4. Xem lịch sử đơn hàng

Actors: Authenticated user

Flow:
1. Client gọi `GET /api/orders` với JWT.
2. order-service truy vấn `orders` của user và trả về danh sách.

---

## 6. Giao diện API chi tiết và ví dụ

Phần này sẽ liệt kê tất cả endpoint chính, các tham số truyền, header cần thiết, ví dụ request và response mẫu. Tôi sẽ đưa ra mẫu chi tiết cho các nhóm API chính.

6.1. Authentication

- POST `/api/auth/register`
  - Request JSON:

```json
{
  "name": "Nguyen Van A",
  "username": "nguyena",
  "email": "nguyena@example.com",
  "password": "P@ssw0rd"
}
```

  - Success Response (201):

```json
{
  "success": true,
  "message": "Tài khoản được tạo. Vui lòng kiểm tra email để xác thực."
}
```

- POST `/api/auth/login`
  - Request:

```json
{
  "email": "nguyena@example.com",
  "password": "P@ssw0rd"
}
```

  - Response:

```json
{
  "success": true,
  "data": {
    "token": "<JWT_TOKEN>",
    "user": { "id": 1, "name": "Nguyen Van A" }
  }
}
```

6.2. Cart API (chi tiết)

- GET `/api/cart`
  - Header: `Authorization: Bearer <token>`
  - Response (200):

```json
{
  "success": true,
  "data": {
    "id": 46,
    "user_id": 1,
    "items": [
      {
        "id": 66,
        "product_sku_id": 1,
        "quantity": 1,
        "price": 30000000.00,
        "product_name": "iPhone 15 Pro Max",
        "product_image": "https://...",
        "sku_name": "IP15PM-BLACK-256GB"
      }
    ]
  }
}
```

- POST `/api/cart/items`
  - Body:

```json
{
  "sku_id": 1,
  "quantity": 2
}
```

  - Response:

```json
{
  "success": true,
  "message": "Item added to cart",
  "data": { /* cart item object */ }
}
```

6.3. Orders & Payments (tóm tắt)

- POST `/api/orders` — tạo đơn, body gồm `cart_id` và `payment_method`.
- Payment flow: order-service -> payment-service -> gateway -> callback.

---

## 7. Cơ sở dữ liệu và mô hình dữ liệu (chi tiết)

7.1. Nguyên tắc thiết kế DB
- Mỗi microservice sở hữu DB riêng (domain ownership)
- Tránh foreign key cross-db

7.2. Chi tiết các bảng chính (schema summary)

User DB (`user_db`):
- `users` (id, avatar, name, username, email, password, role, is_verified, created_at)
- `user_tokens` (id, user_id, token, type, expires_at)

Product DB (`product_db`):
- `products` (id, name, description, image_thumbnail, base_price, discount_percent)
- `product_skus` (id, product_id, sku, price, stock, brand_name)

Cart DB (`cart_db`):
- `cart` (id, user_id, status)
- `cart_item` (id, cart_id, product_sku_id, quantity, price, original_price, has_discount)

Order DB (`order_db`):
- `orders` (id, user_id, cart_id, total, status, shipping_address_id, created_at)
- `order_item` (id, order_id, product_sku_id, quantity, price)

Payment DB (`payment_db`):
- `payment_details` (id, order_id, method, status, amount, transaction_id)

Notification DB (`notification_db`):
- `notification_templates`, `notifications`

7.3. Mối quan hệ và ví dụ JOIN
- Khi cần thông tin product trong cart, cart-service gọi product-service theo `product_sku_id` để tránh cross-db JOIN.

7.4. Migrations
- Khuyến nghị: sử dụng `sequelize-cli` hoặc `umzug` để quản lý migration và seeders.

---

## 8. Triển khai, Docker & môi trường

8.1. Docker Compose (development)

File `docker-compose.yml` chứa cấu hình cho tất cả services, MySQL và Redis. Để chạy local:

```powershell
docker compose up -d --build
```

Kiểm tra logs:

```powershell
docker compose logs -f api-gateway
```

8.2. Biến môi trường cần cấu hình
- DB: `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`
- JWT: `JWT_SECRET`, `JWT_EXPIRES_IN`
- SMTP: `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`
- Payment: `VNPAY_TMN_CODE`, `VNP_HASH_SECRET`, `MOMO_PARTNER_CODE`, ...

8.3. Production deployment recommendations
- Sử dụng registry (DockerHub/GCR/ECR) để push images
- Dùng orchestration: Kubernetes (Helm charts) hoặc Docker Swarm
- Secrets: lưu secrets trong Kubernetes Secrets hoặc Vault

8.4. Zero-downtime deploy
- Sử dụng rolling update trong Kubernetes hoặc strategy tương đương

---

## 9. Bảo mật, quản trị và kiểm toán

9.1. Authentication & Authorization
- JWT cho Auth; phần refresh token nếu cần lâu dài
- RBAC cho admin endpoints

9.2. Hardening
- Helmet.js cho headers
- Rate limiter (express-rate-limit)
- CORS whitelist

9.3. Audit logs
- Ghi lại các hành động quan trọng: login/logout, thay đổi thông tin, thao tác admin

9.4. Backup & Secret management
- Backup định kỳ MySQL và Redis RDB/AOF
- Lưu secrets trong Vault/k8s secrets

---

## 10. Kiểm thử, CI/CD và quality gates

10.1. Unit & Integration tests
- Unit: Jest + mock
- Integration: supertest + test DB instance (Docker Compose test profile)

10.2. Performance & Load testing
- Sử dụng k6 hoặc JMeter để test các nút quan trọng: login, add-to-cart, checkout

10.3. CI pipeline (mẫu GitHub Actions)

```yaml
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with: node-version: 18
      - run: npm ci
      - run: npm test
      - run: docker build -t myrepo/ck_soa-frontend ./frontend
```

10.4. Quality gates
- Run linter (ESLint), tests coverage threshold, security scan (Snyk/Dependabot)

---

## 11. Vận hành, giám sát và backup

11.1. Logging
- Centralized logging: ELK stack (Filebeat -> Logstash -> Elasticsearch -> Kibana) hoặc EFK

11.2. Tracing & Metrics
- OpenTelemetry + Jaeger cho distributed tracing
- Prometheus + Grafana cho metrics và alerting (CPU, memory, request latency, error rate)

11.3. Health checks
- Mỗi service expose `/health` và Docker healthcheck cấu hình trong `docker-compose.yml`.

11.4. Backup strategy
- MySQL daily dump to object storage
- Redis RDB/AOF snapshot and persistence

11.5. Incident response
- Playbook: rollback image, scale pods, notify on-call

---

## 12. Lộ trình phát triển, scale và mở rộng

12.1. Short-term
- Hoàn thiện API documentation (OpenAPI/Swagger)
- Viết thêm tests, tăng coverage

12.2. Medium-term
- Chuyển frontend thành SPA
- Thêm caching ở product-service

12.3. Long-term
- Event-driven architecture: dùng Kafka
- Multi-region deployment

---

## 13. Phụ lục

13.1. File cấu hình quan trọng
- `docker-compose.yml`
- `database/init.sql`
- `frontend/nginx.conf`

13.2. Các lệnh hữu ích

```powershell
# Build & run frontend dev
docker compose up -d --build frontend

# Tail logs
docker compose logs -f cart-service

# Run migration (example)
docker exec -it mysql-db mysql -uroot -ppassword -e "source /docker-entrypoint-initdb.d/init.sql"
```

13.3. Chuyển Markdown sang Word (.docx) bằng pandoc

Nếu bạn muốn tạo file Word trực tiếp, dùng `pandoc` (cần cài trước trên máy Windows):

```powershell
# Cài pandoc: tải từ https://pandoc.org/installing.html
# Chuyển sang DOCX với mục lục
pandoc docs/CK_SOA_Project_Tailieu.md -o docs/CK_SOA_Project_Tailieu.docx --from markdown --toc --toc-depth=2

# Để áp dụng template Word (style), chuẩn bị file reference.docx
pandoc docs/CK_SOA_Project_Tailieu.md -o docs/CK_SOA_Project_Tailieu.docx --reference-doc=reference.docx --toc
```

13.4. Checklist triển khai production
- Đổi `JWT_SECRET` sang giá trị mạnh
- Cấu hình SMTP/Payment keys
- Thiết lập backup
- Thiết lập monitoring và alerting

---

## 14. Tài liệu tham khảo và glossary

- Link tham khảo: Node.js, Express, Sequelize, Docker, Redis, VNPay, MoMo
- Glossary: microservice, SKU, JWT, CI/CD, RDBMS, ORM

---

## Mở rộng nội dung (kế tiếp)

Tôi có thể:
- Bổ sung chi tiết từng endpoint theo chuẩn OpenAPI (sẽ sinh file `openapi.yaml`).
- Sinh ví dụ request/response đầy đủ cho tất cả endpoints (~200+ mẫu) để làm phần appendix.
- Sinh phần user stories chi tiết (từ 30-50 use-cases) để bổ sung vào tài liệu nhằm đạt định lượng trang mong muốn.

Bạn muốn tôi tiếp tục theo bước nào?
- 1) Sinh OpenAPI/Swagger cho toàn bộ API.
- 2) Sinh thêm user stories, ví dụ, và test case để mở rộng tài liệu lên ~70 trang.
- 3) Chuyển Markdown hiện tại sang file `.docx` trong repo bằng `pandoc` (tôi sẽ chạy lệnh nếu bạn cho phép chạy các lệnh trên máy này).

Kết thúc bản mở rộng (phiên bản chi tiết). 
