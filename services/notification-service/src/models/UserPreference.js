const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserPreference = sequelize.define('UserPreference', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  email_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sms_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  push_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  marketing_emails: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  order_updates: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  promotions: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  newsletter: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'user_preferences',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = UserPreference;
