const nodemailer = require('nodemailer');
const Handlebars = require('handlebars');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    this.verifyConnection();
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service ready');
    } catch (error) {
      console.error('❌ Email service error:', error);
    }
  }

  async sendEmail(to, subject, htmlBody, textBody = null) {
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'E-Commerce'}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlBody,
      text: textBody || this.htmlToText(htmlBody)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent:', info.messageId);
      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      console.error('❌ Email send failed:', error);
      throw error;
    }
  }

  compileTemplate(templateBody, variables) {
    const template = Handlebars.compile(templateBody);
    return template(variables);
  }

  htmlToText(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  // Predefined email templates
  async sendVerificationEmail(email, token, userName) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to ${process.env.APP_NAME}!</h2>
        <p>Hi ${userName},</p>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>Or copy this link: <a href="${verificationUrl}">${verificationUrl}</a></p>
        <p style="color: #666; font-size: 12px;">This link will expire in 24 hours.</p>
        <p style="color: #666; font-size: 12px;">If you didn't create an account, please ignore this email.</p>
      </div>
    `;

    return await this.sendEmail(email, 'Verify Your Email Address', html);
  }

  async sendPasswordResetEmail(email, token, userName) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${userName},</p>
        <p>We received a request to reset your password. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #dc3545; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
        <p style="color: #666; font-size: 12px;">This link will expire in 1 hour.</p>
        <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    `;

    return await this.sendEmail(email, 'Reset Your Password', html);
  }

  async sendOrderConfirmationEmail(email, orderData) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p>Hi ${orderData.customerName},</p>
        <p>Thank you for your order! Your order has been received and is being processed.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
          <p><strong>Order Date:</strong> ${new Date(orderData.orderDate).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> ${orderData.totalAmount} VND</p>
          <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
        </div>

        <h3>Items Ordered:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${orderData.items.map(item => `
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px;">${item.productName}</td>
              <td style="padding: 10px; text-align: right;">x${item.quantity}</td>
              <td style="padding: 10px; text-align: right;">${item.price} VND</td>
            </tr>
          `).join('')}
        </table>

        <div style="margin-top: 20px;">
          <a href="${process.env.FRONTEND_URL}/orders/${orderData.orderId}" 
             style="background-color: #28a745; color: white; padding: 10px 20px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            View Order Details
          </a>
        </div>

        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          You will receive another email when your order has been shipped.
        </p>
      </div>
    `;

    return await this.sendEmail(email, `Order Confirmation - ${orderData.orderNumber}`, html);
  }

  async sendOrderStatusUpdateEmail(email, orderData, status) {
    const statusMessages = {
      processing: 'Your order is being processed',
      shipped: 'Your order has been shipped',
      delivered: 'Your order has been delivered',
      cancelled: 'Your order has been cancelled'
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Status Update</h2>
        <p>Hi ${orderData.customerName},</p>
        <p><strong>${statusMessages[status]}</strong></p>
        
        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
          <p><strong>Status:</strong> ${status.toUpperCase()}</p>
          ${orderData.trackingNumber ? `<p><strong>Tracking Number:</strong> ${orderData.trackingNumber}</p>` : ''}
        </div>

        <div style="margin-top: 20px;">
          <a href="${process.env.FRONTEND_URL}/orders/${orderData.orderId}" 
             style="background-color: #007bff; color: white; padding: 10px 20px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Track Your Order
          </a>
        </div>
      </div>
    `;

    return await this.sendEmail(email, `Order ${status} - ${orderData.orderNumber}`, html);
  }

  async sendPromotionalEmail(email, campaign) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${campaign.body}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            You received this email because you subscribed to our promotional emails.
            <a href="${process.env.FRONTEND_URL}/unsubscribe">Unsubscribe</a>
          </p>
        </div>
      </div>
    `;

    return await this.sendEmail(email, campaign.subject, html);
  }
}

module.exports = new EmailService();
