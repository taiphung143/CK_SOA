const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cart = require('./Cart');

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cart_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cart',
      key: 'id'
    }
  },
  product_sku_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  original_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  has_discount: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  discount_percent: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'cart_item',
  timestamps: true,
  createdAt: 'added_at',
  updatedAt: false
});

// Associations
Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id', as: 'cart' });

module.exports = CartItem;
