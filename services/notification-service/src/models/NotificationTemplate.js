const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NotificationTemplate = sequelize.define('NotificationTemplate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: 'Unique identifier for template (e.g., ORDER_CONFIRMATION, WELCOME_EMAIL)'
  },
  channel: {
    type: DataTypes.ENUM('email', 'sms', 'push', 'in_app'),
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Email subject or notification title'
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Template body with Handlebars variables {{variable}}'
  },
  variables: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of required variables for this template'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'notification_templates',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = NotificationTemplate;
