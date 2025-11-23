const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const axios = require('axios');
const { User, UserToken } = require('../models');
const { Op } = require('sequelize');

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3006';

class AuthController {
  async register(req, res, next) {
    try {
      const { name, username, email, password } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }]
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: existingUser.email === email 
            ? 'Email already registered' 
            : 'Username already taken'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
        name,
        username,
        email,
        password: hashedPassword
      });

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

      await UserToken.create({
        user_id: user.id,
        token: verificationToken,
        type: 'verification',
        expires_at: expiresAt
      });

      // Send verification email via Notification Service
      try {
        await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/send`, {
          user_id: user.id,
          recipient: email,
          channel: 'email',
          template_code: 'USER_VERIFICATION',
          variables: {
            userName: name,
            verificationToken: verificationToken
          }
        });
      } catch (error) {
        console.error('Failed to send verification email:', error);
      }

      res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email for verification.',
        data: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check if verified
      if (!user.is_verified) {
        return res.status(403).json({
          success: false,
          message: 'Please verify your email first'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            avatar: user.avatar
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const { token } = req.params;

      // Find token
      const userToken = await UserToken.findOne({
        where: {
          token,
          type: 'verification',
          is_used: false,
          expires_at: { [Op.gt]: new Date() }
        }
      });

      if (!userToken) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired verification token'
        });
      }

      // Update user
      await User.update(
        { is_verified: true, verified_at: new Date() },
        { where: { id: userToken.user_id } }
      );

      // Mark token as used
      await userToken.update({ is_used: true });

      res.json({
        success: true,
        message: 'Email verified successfully. You can now login.'
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.json({
          success: true,
          message: 'If the email exists, a password reset link has been sent.'
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour

      await UserToken.create({
        user_id: user.id,
        token: resetToken,
        type: 'password_reset',
        expires_at: expiresAt
      });

      // Send reset email via Notification Service
      try {
        await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/send`, {
          user_id: user.id,
          recipient: email,
          channel: 'email',
          template_code: 'PASSWORD_RESET',
          variables: {
            userName: user.name,
            resetToken: resetToken
          }
        });
      } catch (error) {
        console.error('Failed to send password reset email:', error);
      }

      res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent.'
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      // Find token
      const userToken = await UserToken.findOne({
        where: {
          token,
          type: 'password_reset',
          is_used: false,
          expires_at: { [Op.gt]: new Date() }
        }
      });

      if (!userToken) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token'
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update user password
      await User.update(
        { password: hashedPassword },
        { where: { id: userToken.user_id } }
      );

      // Mark token as used
      await userToken.update({ is_used: true });

      res.json({
        success: true,
        message: 'Password reset successful. You can now login with your new password.'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
