const { EmailCampaign, NotificationTemplate } = require('../models');
const { emailQueue } = require('../queues');
const axios = require('axios');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3001';

class CampaignController {
  async getAllCampaigns(req, res, next) {
    try {
      const { status } = req.query;
      const whereClause = {};

      if (status) whereClause.status = status;

      const campaigns = await EmailCampaign.findAll({
        where: whereClause,
        include: [{ model: NotificationTemplate, as: 'template' }],
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: campaigns
      });
    } catch (error) {
      next(error);
    }
  }

  async getCampaign(req, res, next) {
    try {
      const { id } = req.params;

      const campaign = await EmailCampaign.findByPk(id, {
        include: [{ model: NotificationTemplate, as: 'template' }]
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      res.json({
        success: true,
        data: campaign
      });
    } catch (error) {
      next(error);
    }
  }

  async createCampaign(req, res, next) {
    try {
      const { name, subject, body, template_id, segment, segment_filter, scheduled_at } = req.body;

      const campaign = await EmailCampaign.create({
        name,
        subject,
        body,
        template_id,
        segment: segment || 'all_users',
        segment_filter,
        scheduled_at: scheduled_at || null,
        status: scheduled_at ? 'scheduled' : 'draft'
      });

      res.status(201).json({
        success: true,
        message: 'Campaign created successfully',
        data: campaign
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCampaign(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const campaign = await EmailCampaign.findByPk(id);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      if (campaign.status === 'sent') {
        return res.status(400).json({
          success: false,
          message: 'Cannot update a sent campaign'
        });
      }

      await campaign.update(updateData);

      res.json({
        success: true,
        message: 'Campaign updated successfully',
        data: campaign
      });
    } catch (error) {
      next(error);
    }
  }

  async sendCampaign(req, res, next) {
    try {
      const { id } = req.params;

      const campaign = await EmailCampaign.findByPk(id);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      if (campaign.status === 'sent' || campaign.status === 'sending') {
        return res.status(400).json({
          success: false,
          message: 'Campaign already sent or sending'
        });
      }

      // Get recipients based on segment
      let recipients = [];
      try {
        // Fetch users from User Service based on segment
        const response = await axios.get(`${USER_SERVICE_URL}/api/users`, {
          params: { segment: campaign.segment }
        });
        recipients = response.data.data.users || [];
      } catch (error) {
        console.error('Failed to fetch recipients:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch recipients'
        });
      }

      // Update campaign status
      await campaign.update({
        status: 'sending',
        total_recipients: recipients.length
      });

      // Queue emails for all recipients
      const { Notification } = require('../models');
      for (const recipient of recipients) {
        const notification = await Notification.create({
          user_id: recipient.id,
          recipient: recipient.email,
          channel: 'email',
          subject: campaign.subject,
          body: campaign.body,
          status: 'pending',
          metadata: { campaign_id: campaign.id }
        });

        await emailQueue.add({
          notificationId: notification.id,
          to: recipient.email,
          subject: campaign.subject,
          body: campaign.body,
          campaignId: campaign.id
        });
      }

      res.json({
        success: true,
        message: `Campaign queued for ${recipients.length} recipients`,
        data: {
          campaign_id: campaign.id,
          total_recipients: recipients.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelCampaign(req, res, next) {
    try {
      const { id } = req.params;

      const campaign = await EmailCampaign.findByPk(id);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      if (campaign.status === 'sent') {
        return res.status(400).json({
          success: false,
          message: 'Cannot cancel a sent campaign'
        });
      }

      await campaign.update({ status: 'cancelled' });

      res.json({
        success: true,
        message: 'Campaign cancelled successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CampaignController();
