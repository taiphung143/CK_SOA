const twilio = require('twilio');

class SMSService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER;
    this.client = null;
    
    // Only initialize if credentials are properly configured
    if (this.accountSid && this.authToken && 
        this.accountSid.startsWith('AC') && this.authToken.length > 10) {
      try {
        this.client = twilio(this.accountSid, this.authToken);
        console.log('✅ SMS service initialized');
      } catch (error) {
        console.error('⚠️  Failed to initialize SMS service:', error.message);
      }
    } else {
      console.warn('⚠️  SMS service not configured (Twilio credentials missing or invalid)');
    }
  }

  async sendSMS(to, message) {
    if (!this.client) {
      console.warn('SMS not sent (service not configured):', message);
      return { success: false, message: 'SMS service not configured' };
    }

    try {
      const result = await this.client.messages.create({
        body: message,
        from: this.phoneNumber,
        to: to
      });

      console.log('✅ SMS sent:', result.sid);
      return {
        success: true,
        messageId: result.sid
      };
    } catch (error) {
      console.error('❌ SMS send failed:', error);
      throw error;
    }
  }

  async sendOrderNotification(phone, orderNumber) {
    const message = `Your order ${orderNumber} has been confirmed. Thank you for shopping with us!`;
    return await this.sendSMS(phone, message);
  }

  async sendVerificationCode(phone, code) {
    const message = `Your verification code is: ${code}. Valid for 10 minutes.`;
    return await this.sendSMS(phone, message);
  }
}

module.exports = new SMSService();
