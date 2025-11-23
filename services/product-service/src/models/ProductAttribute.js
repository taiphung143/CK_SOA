const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductAttribute = sequelize.define('ProductAttribute', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  value: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'product_attributes',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['type', 'value']
    }
  ]
});

module.exports = ProductAttribute;
