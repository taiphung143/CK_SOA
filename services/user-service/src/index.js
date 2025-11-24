const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const addressRoutes = require('./routes/address.routes');
const { errorHandler } = require('./middleware/errorHandler');
const sequelize = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb', strict: false }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Set UTF-8 encoding for responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Content-Length:', req.headers['content-length']);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/users/addresses', addressRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'User Service',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

// Database connection and server start
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');
    return sequelize.sync({ alter: false }); // Don't alter tables, use migrations instead
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 User Service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Unable to connect to database:', err);
    process.exit(1);
  });
