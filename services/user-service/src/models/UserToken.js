const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const UserToken = sequelize.define('UserToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  token: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('verification', 'password_reset'),
    allowNull: false,
    defaultValue: 'verification'
  },
  is_used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'user_tokens',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Associations
User.hasMany(UserToken, { foreignKey: 'user_id', as: 'tokens' });
UserToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = UserToken;
