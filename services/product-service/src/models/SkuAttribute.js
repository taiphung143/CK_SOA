const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SkuAttribute = sequelize.define('SkuAttribute', {
  sku_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'product_skus',
      key: 'id'
    }
  },
  attribute_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'product_attributes',
      key: 'id'
    }
  }
}, {
  tableName: 'sku_attributes',
  timestamps: false
});

module.exports = SkuAttribute;
