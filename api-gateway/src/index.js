const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Service URLs
const SERVICES = {
  user: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  product: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002',
  cart: process.env.CART_SERVICE_URL || 'http://localhost:3003',
  order: process.env.ORDER_SERVICE_URL || 'http://localhost:3004',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
  notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006',
};

// Proxy configuration
const proxyOptions = (serviceName) => ({
  target: SERVICES[serviceName],
  changeOrigin: true,
  ws: false,
  xfwd: true,
  timeout: 60000,
  proxyTimeout: 60000,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[${new Date().toISOString()}] Proxying ${req.method} ${req.path} to ${serviceName}`);
    // Log headers to debug
    console.log('Content-Length:', req.headers['content-length']);
    console.log('Content-Type:', req.headers['content-type']);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[${new Date().toISOString()}] Response from ${serviceName}: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error(`[${new Date().toISOString()}] Error proxying to ${serviceName}:`, err.message);
    if (!res.headersSent) {
      res.status(502).json({
        success: false,
        message: `Service temporarily unavailable`,
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
});

// Health check for gateway itself
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'API Gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Check all services health
app.get('/api/health/all', async (req, res) => {
  const axios = require('axios');
  const healthChecks = {};
  
  for (const [name, url] of Object.entries(SERVICES)) {
    try {
      const response = await axios.get(`${url}/health`, { timeout: 5000 });
      healthChecks[name] = { status: 'UP', ...response.data };
    } catch (error) {
      healthChecks[name] = { status: 'DOWN', error: error.message };
    }
  }
  
  const allHealthy = Object.values(healthChecks).every(check => check.status === 'UP');
  
  res.status(allHealthy ? 200 : 503).json({
    gateway: 'OK',
    services: healthChecks,
    timestamp: new Date().toISOString()
  });
});

// Manual proxy for auth endpoints (workaround for body forwarding issues)
const axios = require('axios');

// Test route to verify route handling works
console.log('🔧 Registering manual routes...');
app.get('/api/test', (req, res) => {
  console.log('TEST ROUTE HIT');
  res.json({ test: 'OK' });
});
console.log('✅ GET /api/test registered');

app.post('/api/auth/login', async (req, res) => {
  console.log(`[${new Date().toISOString()}] ✅ Manual proxy route HIT: POST /api/auth/login`);
  console.log('Request body:', req.body);
  
  try {
    const response = await axios.post(`${SERVICES.user}/api/auth/login`, req.body, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    console.log(`[${new Date().toISOString()}] ✅ Got response from user-service: ${response.status}`);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Login proxy error:`, error.message);
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    } else {
      return res.status(502).json({ success: false, message: 'Service unavailable' });
    }
  }
});

app.post('/api/auth/register', async (req, res) => {
  console.log(`[${new Date().toISOString()}] ✅ Manual proxy route HIT: POST /api/auth/register`);
  console.log('Request body:', req.body);
  
  try {
    const response = await axios.post(`${SERVICES.user}/api/auth/register`, req.body, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    console.log(`[${new Date().toISOString()}] ✅ Got response from user-service: ${response.status}`);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Register proxy error:`, error.message);
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    } else {
      return res.status(502).json({ success: false, message: 'Service unavailable' });
    }
  }
});

app.get('/api/auth/verify-email/:token', async (req, res) => {
  console.log(`[${new Date().toISOString()}] ✅ Manual proxy route HIT: GET /api/auth/verify-email/${req.params.token}`);
  
  try {
    const response = await axios.get(`${SERVICES.user}/api/auth/verify-email/${req.params.token}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    console.log(`[${new Date().toISOString()}] ✅ Got response from user-service: ${response.status}`);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Verify email proxy error:`, error.message);
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    } else {
      return res.status(502).json({ success: false, message: 'Service unavailable' });
    }
  }
});

// Route proxying
// User Service routes - /api/auth/login handled manually above
// app.use('/api/auth', createProxyMiddleware(proxyOptions('user'))); // Commented out - manually handling auth routes
app.use('/api/users', createProxyMiddleware(proxyOptions('user')));
app.use('/api/addresses', createProxyMiddleware(proxyOptions('user')));

// Product Service routes
app.use('/api/products', createProxyMiddleware(proxyOptions('product')));
app.use('/api/categories', createProxyMiddleware(proxyOptions('product')));

// Cart Service routes
app.use('/api/cart', createProxyMiddleware(proxyOptions('cart')));
app.use('/api/wishlist', createProxyMiddleware(proxyOptions('cart')));

// Order Service routes
app.use('/api/orders', createProxyMiddleware(proxyOptions('order')));

// Payment Service routes
app.use('/api/payments', createProxyMiddleware(proxyOptions('payment')));

// Notification Service routes
app.use('/api/notifications', createProxyMiddleware(proxyOptions('notification')));
app.use('/api/templates', createProxyMiddleware(proxyOptions('notification')));
app.use('/api/campaigns', createProxyMiddleware(proxyOptions('notification')));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Gateway Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`=================================`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Services:`);
  Object.entries(SERVICES).forEach(([name, url]) => {
    console.log(`  - ${name}: ${url}`);
  });
  console.log(`=================================`);
});
