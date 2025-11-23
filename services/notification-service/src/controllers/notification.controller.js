const { Notification, NotificationTemplate, UserPreference } = require('../models');
const emailService = require('../services/email.service');
const smsService = require('../services/sms.service');
const { emailQueue, smsQueue } = require('../queues');

class NotificationController {
  // Send notification via specified channel
  async send(req, res, next) {
    try {
      const { 
        user_id, 
        recipient, 
        channel, 
        template_code, 
        variables,
        subject,
        body,
        metadata 
      } = req.body;

      // Check user preferences if user_id provided
      if (user_id) {
        const preferences = await UserPreference.findOne({ where: { user_id } });
        
        if (preferences) {
          if (channel === 'email' && !preferences.email_enabled) {
            return res.status(400).json({
              success: false,
              message: 'User has disabled email notifications'
            });
          }
          if (channel === 'sms' && !preferences.sms_enabled) {
            return res.status(400).json({
              success: false,
              message: 'User has disabled SMS notifications'
            });
          }
        }
      }

      let finalSubject = subject;
      let finalBody = body;

      // If template_code provided, use template
      if (template_code) {
        const template = await NotificationTemplate.findOne({
          where: { code: template_code, is_active: true }
        });

        if (!template) {
          return res.status(404).json({
            success: false,
            message: 'Template not found or inactive'
          });
        }

        if (template.channel !== channel) {
          return res.status(400).json({
            success: false,
            message: `Template is for ${template.channel}, not ${channel}`
          });
        }

        finalSubject = emailService.compileTemplate(template.subject || '', variables || {});
        finalBody = emailService.compileTemplate(template.body, variables || {});
      }

      // Create notification record
      const notification = await Notification.create({
        user_id,
        recipient,
        channel,
        template_code,
        subject: finalSubject,
        body: finalBody,
        status: 'pending',
        metadata
      });

      // Queue notification for sending
      if (channel === 'email') {
        await emailQueue.add({
          notificationId: notification.id,
          to: recipient,
          subject: finalSubject,
          body: finalBody
        });
      } else if (channel === 'sms') {
        await smsQueue.add({
          notificationId: notification.id,
          to: recipient,
          message: finalBody
        });
      }

      res.status(201).json({
        success: true,
        message: 'Notification queued for sending',
        data: {
          notification_id: notification.id,
          status: notification.status
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user's notifications (in-app)
  async getUserNotifications(req, res, next) {
    try {
      const userId = req.user?.userId || req.headers['x-user-id'];
      const { page = 1, limit = 20, unread_only = false } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = { 
        user_id: userId,
        channel: 'in_app'
      };

      if (unread_only === 'true') {
        whereClause.read_at = null;
      }

      const { count, rows } = await Notification.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          notifications: rows,
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

  // Mark notification as read
  async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId || req.headers['x-user-id'];

      const notification = await Notification.findOne({
        where: { id, user_id: userId }
      });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      await notification.update({
        status: 'read',
        read_at: new Date()
      });

      res.json({
        success: true,
        message: 'Notification marked as read'
      });
    } catch (error) {
      next(error);
    }
  }

  // Trigger event-based notification
  async triggerEvent(req, res, next) {
    try {
      const { event_type, user_id, recipient, variables, metadata } = req.body;

      const { NotificationEvent } = require('../models');
      const events = await NotificationEvent.findAll({
        where: { event_type, is_active: true }
      });

      if (events.length === 0) {
        return res.json({
          success: true,
          message: 'No active notification events for this type'
        });
      }

      const notifications = [];
      for (const event of events) {
        const notification = await Notification.create({
          user_id,
          recipient,
          channel: event.channel === 'all' ? 'email' : event.channel,
          template_code: event.template_code,
          status: 'pending',
          metadata: { ...metadata, event_type }
        });

        // Get template and compile
        const template = await NotificationTemplate.findOne({
          where: { code: event.template_code }
        });

        if (template) {
          const subject = emailService.compileTemplate(template.subject || '', variables);
          const body = emailService.compileTemplate(template.body, variables);

          await notification.update({ subject, body });

          // Queue with delay if specified
          const delay = event.delay_minutes * 60 * 1000;
          
          if (template.channel === 'email') {
            await emailQueue.add({
              notificationId: notification.id,
              to: recipient,
              subject,
              body
            }, { delay });
          } else if (template.channel === 'sms') {
            await smsQueue.add({
              notificationId: notification.id,
              to: recipient,
              message: body
            }, { delay });
          }
        }

        notifications.push(notification);
      }

      res.json({
        success: true,
        message: `${notifications.length} notification(s) triggered`,
        data: notifications.map(n => ({ id: n.id, channel: n.channel }))
      });
    } catch (error) {
      next(error);
    }
  }

  // Get notification statistics
  async getStats(req, res, next) {
    try {
      const { start_date, end_date } = req.query;
      const { Op } = require('sequelize');

      const whereClause = {};
      if (start_date && end_date) {
        whereClause.created_at = {
          [Op.between]: [new Date(start_date), new Date(end_date)]
        };
      }

      const total = await Notification.count({ where: whereClause });
      const sent = await Notification.count({ 
        where: { ...whereClause, status: 'sent' } 
      });
      const failed = await Notification.count({ 
        where: { ...whereClause, status: 'failed' } 
      });
      const pending = await Notification.count({ 
        where: { ...whereClause, status: 'pending' } 
      });

      const byChannel = await Notification.findAll({
        where: whereClause,
        attributes: [
          'channel',
          [require('sequelize').fn('COUNT', 'id'), 'count']
        ],
        group: ['channel']
      });

      res.json({
        success: true,
        data: {
          total,
          sent,
          failed,
          pending,
          success_rate: total > 0 ? ((sent / total) * 100).toFixed(2) + '%' : '0%',
          by_channel: byChannel
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();
