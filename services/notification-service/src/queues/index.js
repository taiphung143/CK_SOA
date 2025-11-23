const Queue = require('bull');
const emailService = require('../services/email.service');
const smsService = require('../services/sms.service');
const { Notification, EmailCampaign } = require('../models');

// Create queues
const emailQueue = new Queue('email-notifications', {
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379
  }
});

const smsQueue = new Queue('sms-notifications', {
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379
  }
});

// Email queue processor
emailQueue.process(async (job) => {
  const { notificationId, to, subject, body, campaignId } = job.data;
  
  console.log(`📧 Processing email notification ${notificationId} to ${to}`);

  try {
    const result = await emailService.sendEmail(to, subject, body);

    // Update notification status
    await Notification.update(
      { 
        status: 'sent', 
        sent_at: new Date() 
      },
      { where: { id: notificationId } }
    );

    // Update campaign stats if applicable
    if (campaignId) {
      await EmailCampaign.increment('sent_count', { where: { id: campaignId } });
    }

    console.log(`✅ Email sent successfully: ${result.messageId}`);
    return result;
  } catch (error) {
    console.error(`❌ Email send failed:`, error);

    // Update notification with error
    await Notification.update(
      { 
        status: 'failed', 
        error_message: error.message 
      },
      { where: { id: notificationId } }
    );

    // Update campaign stats if applicable
    if (campaignId) {
      await EmailCampaign.increment('failed_count', { where: { id: campaignId } });
    }

    throw error;
  }
});

// SMS queue processor
smsQueue.process(async (job) => {
  const { notificationId, to, message } = job.data;
  
  console.log(`📱 Processing SMS notification ${notificationId} to ${to}`);

  try {
    const result = await smsService.sendSMS(to, message);

    await Notification.update(
      { 
        status: 'sent', 
        sent_at: new Date() 
      },
      { where: { id: notificationId } }
    );

    console.log(`✅ SMS sent successfully: ${result.messageId}`);
    return result;
  } catch (error) {
    console.error(`❌ SMS send failed:`, error);

    await Notification.update(
      { 
        status: 'failed', 
        error_message: error.message 
      },
      { where: { id: notificationId } }
    );

    throw error;
  }
});

// Queue event handlers
emailQueue.on('completed', (job) => {
  console.log(`✅ Email job ${job.id} completed`);
});

emailQueue.on('failed', (job, err) => {
  console.error(`❌ Email job ${job.id} failed:`, err.message);
});

smsQueue.on('completed', (job) => {
  console.log(`✅ SMS job ${job.id} completed`);
});

smsQueue.on('failed', (job, err) => {
  console.error(`❌ SMS job ${job.id} failed:`, err.message);
});

function initializeQueues() {
  console.log('🔄 Job queues initialized and ready');
}

module.exports = {
  emailQueue,
  smsQueue,
  initializeQueues
};
