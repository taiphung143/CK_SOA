const NotificationTemplate = require('./NotificationTemplate');
const Notification = require('./Notification');
const EmailCampaign = require('./EmailCampaign');
const UserPreference = require('./UserPreference');
const NotificationEvent = require('./NotificationEvent');

// Associations
EmailCampaign.belongsTo(NotificationTemplate, { 
  foreignKey: 'template_id', 
  as: 'template' 
});

module.exports = {
  NotificationTemplate,
  Notification,
  EmailCampaign,
  UserPreference,
  NotificationEvent
};
