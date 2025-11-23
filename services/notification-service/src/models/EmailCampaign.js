const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmailCampaign = sequelize.define('EmailCampaign', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  template_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'notification_templates',
      key: 'id'
    }
  },
  segment: {
    type: DataTypes.ENUM('all_users', 'verified_users', 'customers', 'inactive_users', 'custom'),
    defaultValue: 'all_users'
  },
  segment_filter: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Custom filter criteria for user selection'
  },
  status: {
    type: DataTypes.ENUM('draft', 'scheduled', 'sending', 'sent', 'cancelled'),
    defaultValue: 'draft'
  },
  scheduled_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  sent_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  total_recipients: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  sent_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  failed_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  opened_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  clicked_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'email_campaigns',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = EmailCampaign;
