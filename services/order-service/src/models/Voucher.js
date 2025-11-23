const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Voucher = sequelize.define('Voucher', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  discount_percent: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  start_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  end_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'vouchers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Voucher;
