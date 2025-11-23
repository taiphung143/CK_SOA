const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SubmissionTracking = sequelize.define('SubmissionTracking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  submission_time: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'submission_tracking',
  timestamps: false
});

module.exports = SubmissionTracking;
