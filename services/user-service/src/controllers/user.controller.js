const { User } = require('../models');
const bcrypt = require('bcrypt');

class UserController {
  async getProfile(req, res, next) {
    try {
      const user = await User.findByPk(req.user.userId, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { name, phone_number, birth, avatar } = req.body;
      
      const user = await User.findByPk(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      await user.update({
        name: name || user.name,
        phone_number: phone_number || user.phone_number,
        birth: birth || user.birth,
        avatar: avatar || user.avatar
      });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          phone_number: user.phone_number,
          birth: user.birth,
          avatar: user.avatar
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findByPk(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ password: hashedPassword });

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req, res, next) {
    try {
      const user = await User.findByPk(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      await user.destroy();

      res.json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin only: Get all users
  async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = search ? {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { username: { [Op.like]: `%${search}%` } }
        ]
      } : {};

      const { count, rows } = await User.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['password'] },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          users: rows,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const total = await User.count();
      
      res.json({
        success: true,
        total: total
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
