const nodemailer = require('nodemailer');
const { 
  otpEmailTemplate, 
  passwordResetSuccessTemplate,
  registrationConfirmationTemplate
} = require('../templates/email.templates');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  /**
   * Generate 6-digit OTP
   */
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP email
   */
  async sendOTPEmail(email, otp, name) {
    const mailOptions = {
      from: `"Placify" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP - Placify',
      html: otpEmailTemplate(name, otp)
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Email send error:', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send password reset success email
   */
  async sendPasswordResetSuccessEmail(email, name) {
    const mailOptions = {
      from: `"Placify" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Successful - Placify',
      html: passwordResetSuccessTemplate(name)
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Email send error:', error);
      // Don't throw error for success email
      return { success: false };
    }
  }

  /**
   * Send registration confirmation email
   */
  async sendRegistrationConfirmation(email, name) {
    const mailOptions = {
      from: `"Placify" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Placify - Registration Confirmed',
      html: registrationConfirmationTemplate(name, email)
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Email send error:', error);
      // Don't throw error for welcome email
      return { success: false };
    }
  }
}

module.exports = new EmailService();