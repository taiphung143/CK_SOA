const { NotificationTemplate } = require('../models');

class TemplateController {
  async getAllTemplates(req, res, next) {
    try {
      const { channel, is_active } = req.query;
      const whereClause = {};

      if (channel) whereClause.channel = channel;
      if (is_active !== undefined) whereClause.is_active = is_active === 'true';

      const templates = await NotificationTemplate.findAll({
        where: whereClause,
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: templates
      });
    } catch (error) {
      next(error);
    }
  }

  async getTemplate(req, res, next) {
    try {
      const { id } = req.params;

      const template = await NotificationTemplate.findByPk(id);
      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      res.json({
        success: true,
        data: template
      });
    } catch (error) {
      next(error);
    }
  }

  async createTemplate(req, res, next) {
    try {
      const { name, code, channel, subject, body, variables } = req.body;

      const template = await NotificationTemplate.create({
        name,
        code,
        channel,
        subject,
        body,
        variables
      });

      res.status(201).json({
        success: true,
        message: 'Template created successfully',
        data: template
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTemplate(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const template = await NotificationTemplate.findByPk(id);
      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      await template.update(updateData);

      res.json({
        success: true,
        message: 'Template updated successfully',
        data: template
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTemplate(req, res, next) {
    try {
      const { id } = req.params;

      const template = await NotificationTemplate.findByPk(id);
      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      await template.update({ is_active: false });

      res.json({
        success: true,
        message: 'Template deactivated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TemplateController();
