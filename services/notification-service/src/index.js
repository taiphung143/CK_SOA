const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const notificationRoutes = require('./routes/notification.routes');
const templateRoutes = require('./routes/template.routes');
const campaignRoutes = require('./routes/campaign.routes');
const { errorHandler } = require('./middleware/errorHandler');
const sequelize = require('./config/database');
const { initializeQueues } = require('./queues');

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/notifications', notificationRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/campaigns', campaignRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Notification Service',
    timestamp: new Date().toISOString()
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3006;

// Database connection and server start
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');
    return sequelize.sync({ alter: false });
  })
  .then(() => {
    // Initialize job queues
    initializeQueues();
    console.log('✅ Job queues initialized');
    
    app.listen(PORT, () => {
      console.log(`🚀 Notification Service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Unable to connect to database:', err);
    process.exit(1);
  });
