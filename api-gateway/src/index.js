const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
// const { authenticateToken } = require('./middleware/auth.middleware');
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

// Service URLs (use container names from docker-compose)
const SERVICES = {
  user: process.env.USER_SERVICE_URL || 'http://user-service:3001',
  product: process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002',
  cart: process.env.CART_SERVICE_URL || 'http://cart-service:3003',
  order: process.env.ORDER_SERVICE_URL || 'http://order-service:3004',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3005',
  notification: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3006',
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
    console.log(`[${new Date().toISOString()}] Proxying ${req.method} ${req.path} to ${serviceName} (${SERVICES[serviceName]})`);
    // Log headers to debug
    console.log('Content-Length:', req.headers['content-length']);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Authorization header present:', !!req.headers['authorization']);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[${new Date().toISOString()}] Response from ${serviceName}: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error(`[${new Date().toISOString()}] Error proxying to ${serviceName}:`, err.message);
    console.error('Error details:', err);
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

app.put('/api/users/addresses/:id', async (req, res) => {
  console.log(`[${new Date().toISOString()}] ✅ Manual proxy route HIT: PUT /api/users/addresses/${req.params.id}`);
  console.log('Request body:', req.body);
  console.log('Authorization header:', req.headers.authorization);
  
  try {
    const response = await axios.put(`${SERVICES.user}/api/users/addresses/${req.params.id}`, req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization
      },
      timeout: 30000
    });
    console.log(`[${new Date().toISOString()}] ✅ Got response from user-service: ${response.status}`);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Address update proxy error:`, error.message);
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    } else {
      return res.status(502).json({ success: false, message: 'Service unavailable' });
    }
  }
});

app.post('/api/users/addresses', async (req, res) => {
  console.log(`[${new Date().toISOString()}] ✅ Manual proxy route HIT: POST /api/users/addresses`);
  console.log('Request body:', req.body);
  console.log('Authorization header:', req.headers.authorization);
  
  try {
    const response = await axios.post(`${SERVICES.user}/api/users/addresses`, req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization
      },
      timeout: 30000
    });
    console.log(`[${new Date().toISOString()}] ✅ Got response from user-service: ${response.status}`);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Address create proxy error:`, error.message);
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    } else {
      return res.status(502).json({ success: false, message: 'Service unavailable' });
    }
  }
});

app.put('/api/users/profile', async (req, res) => {
  console.log(`[${new Date().toISOString()}] ✅ Manual proxy route HIT: PUT /api/users/profile`);
  console.log('Request body:', req.body);
  console.log('Authorization header:', req.headers.authorization);
  
  try {
    const response = await axios.put(`${SERVICES.user}/api/users/profile`, req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization
      },
      timeout: 30000
    });
    console.log(`[${new Date().toISOString()}] ✅ Got response from user-service: ${response.status}`);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Profile update proxy error:`, error.message);
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    } else {
      return res.status(502).json({ success: false, message: 'Service unavailable' });
    }
  }
});

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

// Manual proxy for orders to ensure body is forwarded correctly
app.post('/api/orders', async (req, res) => {
  console.log(`[${new Date().toISOString()}] ✅ Manual proxy route HIT: POST /api/orders`);
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
  
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Forward authorization header if present
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
      
      // Parse JWT to get userId
      try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const decoded = require('jsonwebtoken').decode(token);
        if (decoded && decoded.userId) {
          headers['x-user-id'] = decoded.userId.toString();
          console.log('Extracted user ID from JWT:', decoded.userId);
        }
      } catch (err) {
        console.error('Failed to decode JWT:', err.message);
      }
    }
    
    // Forward x-user-id if present (from JWT middleware)
    if (req.headers['x-user-id']) {
      headers['x-user-id'] = req.headers['x-user-id'];
    }
    
    console.log('Forwarding to:', `${SERVICES.order}/api/orders`);
    const response = await axios.post(`${SERVICES.order}/api/orders`, req.body, {
      headers,
      timeout: 30000
    });
    console.log(`[${new Date().toISOString()}] ✅ Got response from order-service: ${response.status}`);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Create order proxy error:`, error.message);
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
      return res.status(error.response.status).json(error.response.data);
    } else {
      return res.status(502).json({ success: false, message: 'Service unavailable', detail: error.message });
    }
  }
});

app.get('/api/orders', async (req, res) => {
  console.log(`[${new Date().toISOString()}] ✅ Manual proxy route HIT: GET /api/orders`);
  console.log('Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
  
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Forward authorization header if present
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
      
      // Parse JWT to get userId
      try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const decoded = require('jsonwebtoken').decode(token);
        if (decoded && decoded.userId) {
          headers['x-user-id'] = decoded.userId.toString();
          console.log('Extracted user ID from JWT:', decoded.userId);
        }
      } catch (err) {
        console.error('Failed to decode JWT:', err.message);
      }
    }
    
    // Forward x-user-id if present (from JWT middleware)
    if (req.headers['x-user-id']) {
      headers['x-user-id'] = req.headers['x-user-id'];
    }
    
    console.log('Forwarding to:', `${SERVICES.order}/api/orders`);
    const response = await axios.get(`${SERVICES.order}/api/orders`, {
      headers,
      timeout: 30000
    });
    console.log(`[${new Date().toISOString()}] ✅ Got response from order-service: ${response.status}`);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Get orders proxy error:`, error.message);
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
      return res.status(error.response.status).json(error.response.data);
    } else {
      return res.status(502).json({ success: false, message: 'Service unavailable', detail: error.message });
    }
  }
});

app.get('/api/orders/:id', async (req, res) => {
  console.log(`[${new Date().toISOString()}] ✅ Manual proxy route HIT: GET /api/orders/${req.params.id}`);
  console.log('Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
  
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Forward authorization header if present
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
      
      // Parse JWT to get userId
      try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const decoded = require('jsonwebtoken').decode(token);
        if (decoded && decoded.userId) {
          headers['x-user-id'] = decoded.userId.toString();
          console.log('Extracted user ID from JWT:', decoded.userId);
        }
      } catch (err) {
        console.error('Failed to decode JWT:', err.message);
      }
    }
    
    // Forward x-user-id if present (from JWT middleware)
    if (req.headers['x-user-id']) {
      headers['x-user-id'] = req.headers['x-user-id'];
    }
    
    console.log('Forwarding to:', `${SERVICES.order}/api/orders/${req.params.id}`);
    const response = await axios.get(`${SERVICES.order}/api/orders/${req.params.id}`, {
      headers,
      timeout: 30000
    });
    console.log(`[${new Date().toISOString()}] ✅ Got response from order-service: ${response.status}`);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Get order details proxy error:`, error.message);
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
      return res.status(error.response.status).json(error.response.data);
    } else {
      return res.status(502).json({ success: false, message: 'Service unavailable', detail: error.message });
    }
  }
});

// Manual proxy for cart items to ensure body is forwarded correctly
app.post('/api/cart/items', async (req, res) => {
  console.log(`[${new Date().toISOString()}] ✅ Manual proxy route HIT: POST /api/cart/items`);
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
  
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
      
      // Parse JWT to get userId
      try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const decoded = require('jsonwebtoken').decode(token);
        if (decoded && decoded.userId) {
          headers['x-user-id'] = decoded.userId.toString();
          console.log('Extracted user ID from JWT:', decoded.userId);
        }
      } catch (err) {
        console.error('Failed to decode JWT:', err.message);
      }
    }
    
    if (req.headers['x-user-id']) {
      headers['x-user-id'] = req.headers['x-user-id'];
    }
    
    console.log('Forwarding to:', `${SERVICES.cart}/api/cart/items`);
    console.log('Headers:', headers);
    const response = await axios.post(`${SERVICES.cart}/api/cart/items`, req.body, {
      headers,
      timeout: 30000
    });
    console.log(`[${new Date().toISOString()}] ✅ Got response from cart-service: ${response.status}`);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Add to cart proxy error:`, error.message);
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
      return res.status(error.response.status).json(error.response.data);
    } else {
      return res.status(502).json({ success: false, message: 'Cart service unavailable', detail: error.message });
    }
  }
});
app.put('/api/cart/items/:item_id', async (req, res) => {
  console.log(`[${new Date().toISOString()}] ✅ Manual proxy route HIT: PUT /api/cart/items/${req.params.item_id}`);
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
  
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
      
      // Parse JWT to get userId
      try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const decoded = require('jsonwebtoken').decode(token);
        if (decoded && decoded.userId) {
          headers['x-user-id'] = decoded.userId.toString();
          console.log('Extracted user ID from JWT:', decoded.userId);
        }
      } catch (err) {
        console.error('Failed to decode JWT:', err.message);
      }
    }
    
    if (req.headers['x-user-id']) {
      headers['x-user-id'] = req.headers['x-user-id'];
    }
    
    console.log('Forwarding to:', `${SERVICES.cart}/api/cart/items/${req.params.item_id}`);
    console.log('Headers:', headers);
    const response = await axios.put(`${SERVICES.cart}/api/cart/items/${req.params.item_id}`, req.body, {
      headers,
      timeout: 30000
    });
    console.log(`[${new Date().toISOString()}] ✅ Got response from cart-service: ${response.status}`);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Update cart item proxy error:`, error.message);
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
      return res.status(error.response.status).json(error.response.data);
    } else {
      return res.status(502).json({ success: false, message: 'Cart service unavailable', detail: error.message });
    }
  }
});

// Manual proxy for removing cart items
app.delete('/api/cart/items/:item_id', async (req, res) => {
  console.log(`[${new Date().toISOString()}] ✅ Manual proxy route HIT: DELETE /api/cart/items/${req.params.item_id}`);
  console.log('Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
  
  try {
    const headers = {};
    
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
      
      // Parse JWT to get userId
      try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const decoded = require('jsonwebtoken').decode(token);
        if (decoded && decoded.userId) {
          headers['x-user-id'] = decoded.userId.toString();
          console.log('Extracted user ID from JWT:', decoded.userId);
        }
      } catch (err) {
        console.error('Failed to decode JWT:', err.message);
      }
    }
    
    if (req.headers['x-user-id']) {
      headers['x-user-id'] = req.headers['x-user-id'];
    }
    
    console.log('Forwarding to:', `${SERVICES.cart}/api/cart/items/${req.params.item_id}`);
    console.log('Headers:', headers);
    const response = await axios.delete(`${SERVICES.cart}/api/cart/items/${req.params.item_id}`, {
      headers,
      timeout: 30000
    });
    console.log(`[${new Date().toISOString()}] ✅ Got response from cart-service: ${response.status}`);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Remove cart item proxy error:`, error.message);
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
      return res.status(error.response.status).json(error.response.data);
    } else {
      return res.status(502).json({ success: false, message: 'Cart service unavailable', detail: error.message });
    }
  }
});
// User Service routes - /api/auth/login handled manually above
// app.use('/api/auth', createProxyMiddleware(proxyOptions('user'))); // Commented out - manually handling auth routes
app.use('/api/users', createProxyMiddleware(proxyOptions('user')));
app.use('/api/addresses', createProxyMiddleware(proxyOptions('user')));

// Product Service routes
app.use('/api/products', createProxyMiddleware(proxyOptions('product')));
app.use('/api/categories', createProxyMiddleware(proxyOptions('product')));

// Cart Service routes
// Middleware to parse JWT and add x-user-id header for cart routes
app.use('/api/cart', (req, res, next) => {
  if (req.headers.authorization) {
    try {
      const token = req.headers.authorization.replace('Bearer ', '');
      const decoded = require('jsonwebtoken').decode(token);
      if (decoded && decoded.userId) {
        req.headers['x-user-id'] = decoded.userId.toString();
        console.log(`[${new Date().toISOString()}] Added x-user-id: ${decoded.userId} for ${req.method} ${req.path}`);
      }
    } catch (err) {
      console.error('Failed to decode JWT for cart route:', err.message);
    }
  }
  next();
});
app.use('/api/cart', createProxyMiddleware(proxyOptions('cart')));
app.use('/api/wishlist', createProxyMiddleware(proxyOptions('cart')));

// Order Service routes - POST /api/orders handled manually above  
// Comment out to use manual route instead
// app.use('/api/orders', createProxyMiddleware(proxyOptions('order')));

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
