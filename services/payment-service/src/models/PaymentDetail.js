const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaymentDetail = sequelize.define('PaymentDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  method: {
    type: DataTypes.ENUM('vnpay', 'momo', 'cod'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  transaction_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  paid_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'payment_details',
  timestamps: false
});

module.exports = PaymentDetail;
