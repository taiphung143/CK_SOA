const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product');

const ProductSKU = sequelize.define('ProductSKU', {
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
  sku: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  brand_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'product_skus',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associations
Product.hasMany(ProductSKU, { foreignKey: 'product_id', as: 'skus' });
ProductSKU.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = ProductSKU;
