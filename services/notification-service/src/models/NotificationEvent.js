const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NotificationEvent = sequelize.define('NotificationEvent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  event_type: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'e.g., user.registered, order.created, payment.completed'
  },
  template_code: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  channel: {
    type: DataTypes.ENUM('email', 'sms', 'push', 'in_app', 'all'),
    defaultValue: 'email'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  delay_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Delay before sending notification'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  }
}, {
  tableName: 'notification_events',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['event_type'] },
    { fields: ['is_active'] }
  ]
});

module.exports = NotificationEvent;
