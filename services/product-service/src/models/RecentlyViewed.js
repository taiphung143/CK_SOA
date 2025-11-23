const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecentlyViewed = sequelize.define('RecentlyViewed', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  viewed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'recently_viewed',
  timestamps: false
});

module.exports = RecentlyViewed;
