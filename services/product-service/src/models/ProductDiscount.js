const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductDiscount = sequelize.define('ProductDiscount', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
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
  tableName: 'product_discounts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ProductDiscount;
