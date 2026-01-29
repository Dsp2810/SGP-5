/**
 * Email Templates for Placify
 * Professional HTML email templates for authentication and notifications
 */

/**
 * OTP Email Template for Password Reset
 * @param {string} name - User's name
 * @param {string} otp - 6-digit OTP code
 * @returns {string} HTML email content
 */
const otpEmailTemplate = (name, otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6; 
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .header-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .content { 
          padding: 40px 30px;
          background: #ffffff;
        }
        .content p {
          margin: 0 0 15px 0;
          color: #555;
        }
        .otp-box { 
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border: 2px dashed #667eea; 
          padding: 25px; 
          text-align: center; 
          margin: 30px 0; 
          border-radius: 10px;
        }
        .otp-label {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .otp { 
          font-size: 36px; 
          font-weight: bold; 
          color: #667eea; 
          letter-spacing: 10px;
          font-family: 'Courier New', monospace;
        }
        .warning { 
          background: #fff3cd; 
          border-left: 4px solid #ffc107; 
          padding: 15px 20px; 
          margin: 25px 0; 
          border-radius: 4px;
        }
        .warning strong {
          color: #856404;
        }
        .info-box {
          background: #e7f3ff;
          border-left: 4px solid #2196F3;
          padding: 15px 20px;
          margin: 25px 0;
          border-radius: 4px;
        }
        .info-box ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .info-box li {
          margin: 8px 0;
          color: #555;
        }
        .footer { 
          text-align: center; 
          color: #999; 
          font-size: 12px; 
          padding: 20px 30px;
          background: #f9f9f9;
          border-top: 1px solid #eee;
        }
        .footer p {
          margin: 5px 0;
        }
        .brand {
          color: #667eea;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-icon">🔐</div>
          <h1>Password Reset Request</h1>
        </div>
        
        <div class="content">
          <p>Hello <strong>${name}</strong>,</p>
          <p>We received a request to reset your password for your <span class="brand">Placify</span> account.</p>
          
          <div class="otp-box">
            <p class="otp-label">Your OTP Code</p>
            <div class="otp">${otp}</div>
          </div>

          <div class="warning">
            <strong>⏱️ Important:</strong> This OTP is valid for <strong>10 minutes</strong> only. 
            After that, you'll need to request a new one.
          </div>

          <div class="info-box">
            <p><strong>🛡️ Security Tips:</strong></p>
            <ul>
              <li>Never share this OTP with anyone, including Placify support</li>
              <li>We will never ask for your OTP via phone or email</li>
              <li>If you didn't request this reset, please ignore this email and secure your account</li>
            </ul>
          </div>

          <p style="margin-top: 30px;">Best regards,<br><strong class="brand">Placify Team</strong></p>
        </div>

        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>&copy; 2026 <span class="brand">Placify</span>. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Password Reset Success Email Template
 * @param {string} name - User's name
 * @returns {string} HTML email content
 */
const passwordResetSuccessTemplate = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6; 
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .header-icon {
          font-size: 64px;
          margin-bottom: 10px;
        }
        .content { 
          padding: 40px 30px;
          background: #ffffff;
        }
        .content p {
          margin: 0 0 15px 0;
          color: #555;
        }
        .success-box {
          background: #d4edda;
          border-left: 4px solid #28a745;
          padding: 20px;
          margin: 25px 0;
          border-radius: 4px;
          text-align: center;
        }
        .success-box p {
          margin: 0;
          color: #155724;
          font-size: 18px;
          font-weight: 500;
        }
        .info-box {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px 20px;
          margin: 25px 0;
          border-radius: 4px;
        }
        .info-box ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .info-box li {
          margin: 8px 0;
          color: #555;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
          font-weight: 600;
        }
        .footer { 
          text-align: center; 
          color: #999; 
          font-size: 12px; 
          padding: 20px 30px;
          background: #f9f9f9;
          border-top: 1px solid #eee;
        }
        .footer p {
          margin: 5px 0;
        }
        .brand {
          color: #667eea;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-icon">✅</div>
          <h1>Password Reset Successful</h1>
        </div>
        
        <div class="content">
          <p>Hello <strong>${name}</strong>,</p>
          
          <div class="success-box">
            <p>🎉 Your password has been successfully reset!</p>
          </div>

          <p>You can now log in to your <span class="brand">Placify</span> account using your new password.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="#" class="button">Go to Login</a>
          </div>

          <div class="info-box">
            <p><strong>🔒 Security Reminder:</strong></p>
            <ul>
              <li>Keep your password secure and don't share it with anyone</li>
              <li>Use a unique password for Placify</li>
              <li>If you didn't make this change, please contact our support team immediately</li>
              <li>Consider enabling two-factor authentication for extra security</li>
            </ul>
          </div>

          <p style="margin-top: 30px;">Thank you for using <span class="brand">Placify</span>!</p>
          <p>Best regards,<br><strong class="brand">Placify Team</strong></p>
        </div>

        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>If you need help, contact us at support@Placify.com</p>
          <p>&copy; 2026 <span class="brand">Placify</span>. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Welcome Email Template (for new registrations)
 * @param {string} name - User's name
 * @returns {string} HTML email content
 */
const welcomeEmailTemplate = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6; 
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .header-icon {
          font-size: 64px;
          margin-bottom: 10px;
        }
        .content { 
          padding: 40px 30px;
          background: #ffffff;
        }
        .brand {
          color: #667eea;
          font-weight: bold;
        }
        .footer { 
          text-align: center; 
          color: #999; 
          font-size: 12px; 
          padding: 20px 30px;
          background: #f9f9f9;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-icon">👋</div>
          <h1>Welcome to Placify!</h1>
        </div>
        
        <div class="content">
          <p>Hello <strong>${name}</strong>,</p>
          <p>Welcome to <span class="brand">Placify</span>! We're excited to have you on board.</p>
          <p>Your account has been successfully created. You can now access all our features to boost your career journey.</p>
          <p>Best regards,<br><strong class="brand">Placify Team</strong></p>
        </div>

        <div class="footer">
          <p>&copy; 2026 <span class="brand">Placify</span>. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Account Registration Confirmation Template
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @returns {string} HTML email content
 */
const registrationConfirmationTemplate = (name, email) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6; 
          color: #333;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
        }
        .email-wrapper {
          max-width: 600px;
          margin: 0 auto;
        }
        .container { 
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 50px 40px; 
          text-align: center;
          position: relative;
        }
        .header::after {
          content: '';
          position: absolute;
          bottom: -20px;
          left: 0;
          right: 0;
          height: 40px;
          background: white;
          border-radius: 50% 50% 0 0 / 100% 100% 0 0;
        }
        .header-icon {
          width: 80px;
          height: 80px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          border: 3px solid rgba(255,255,255,0.3);
        }
        .header-icon svg {
          width: 40px;
          height: 40px;
          fill: white;
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .header p {
          margin: 10px 0 0 0;
          font-size: 16px;
          opacity: 0.9;
        }
        .content { 
          padding: 50px 40px 40px;
          background: #ffffff;
        }
        .content h2 {
          color: #667eea;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .content p {
          margin: 0 0 16px 0;
          color: #555;
          font-size: 15px;
        }
        .confirmation-box {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-left: 4px solid #667eea;
          padding: 25px;
          margin: 30px 0;
          border-radius: 8px;
        }
        .confirmation-box h3 {
          color: #667eea;
          margin-bottom: 15px;
          font-size: 18px;
        }
        .detail-row {
          display: flex;
          padding: 10px 0;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: 600;
          color: #667eea;
          min-width: 120px;
        }
        .detail-value {
          color: #555;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin: 30px 0;
        }
        .feature-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border: 2px solid #e9ecef;
          transition: all 0.3s ease;
        }
        .feature-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
          color: white;
          font-size: 24px;
          font-weight: bold;
        }
        .feature-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .feature-desc {
          font-size: 12px;
          color: #666;
          line-height: 1.4;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 16px 40px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          transition: all 0.3s ease;
        }
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #ddd, transparent);
          margin: 30px 0;
        }
        .security-notice {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 20px;
          margin: 30px 0;
          border-radius: 4px;
        }
        .security-notice h4 {
          color: #856404;
          margin-bottom: 10px;
          font-size: 16px;
        }
        .security-notice p {
          color: #856404;
          margin: 0;
          font-size: 14px;
        }
        .footer { 
          text-align: center; 
          color: #999; 
          font-size: 13px; 
          padding: 30px 40px;
          background: #f8f9fa;
          border-top: 1px solid #e9ecef;
        }
        .footer p {
          margin: 8px 0;
        }
        .footer a {
          color: #667eea;
          text-decoration: none;
        }
        .brand {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
        }
        .social-links {
          margin: 20px 0;
        }
        .social-links a {
          display: inline-block;
          width: 36px;
          height: 36px;
          background: #667eea;
          color: white;
          border-radius: 50%;
          text-align: center;
          line-height: 36px;
          margin: 0 5px;
          text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
          .feature-grid {
            grid-template-columns: 1fr;
          }
          .content, .footer {
            padding: 30px 20px;
          }
          .header {
            padding: 40px 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <div class="header-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            </div>
            <h1>Registration Confirmed</h1>
            <p>Your account has been successfully created</p>
          </div>
          
          <div class="content">
            <h2>Welcome to Placify, ${name}!</h2>
            
            <p>Thank you for joining <span class="brand">Placify</span>. We're thrilled to have you as part of our growing community of professionals.</p>
            
            <div class="confirmation-box">
              <h3>Account Details</h3>
              <div class="detail-row">
                <div class="detail-label">Full Name:</div>
                <div class="detail-value">${name}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Email Address:</div>
                <div class="detail-value">${email}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Account Type:</div>
                <div class="detail-value">Student</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Status:</div>
                <div class="detail-value" style="color: #28a745; font-weight: 600;">Active</div>
              </div>
            </div>

            <div class="divider"></div>

            <h3 style="text-align: center; color: #333; margin-bottom: 25px;">What's Available For You</h3>
            
            <div class="feature-grid">
              <div class="feature-card">
                <div class="feature-icon">R</div>
                <div class="feature-title">Resume Builder</div>
                <div class="feature-desc">Create professional resumes with multiple templates</div>
              </div>
              <div class="feature-card">
                <div class="feature-icon">J</div>
                <div class="feature-title">Job Tracker</div>
                <div class="feature-desc">Track your job applications efficiently</div>
              </div>
              <div class="feature-card">
                <div class="feature-icon">A</div>
                <div class="feature-title">ATS Analyzer</div>
                <div class="feature-desc">Optimize your resume for ATS systems</div>
              </div>
              <div class="feature-card">
                <div class="feature-icon">M</div>
                <div class="feature-title">Mock Interviews</div>
                <div class="feature-desc">Practice with AI-powered interviews</div>
              </div>
            </div>

            <div style="text-align: center; margin: 40px 0;">
              <a href="#" class="cta-button">Get Started Now</a>
            </div>

            <div class="security-notice">
              <h4>Security Reminder</h4>
              <p>Keep your account secure by using a strong password and never sharing your login credentials with anyone. If you notice any suspicious activity, please contact our support team immediately.</p>
            </div>

            <div class="divider"></div>

            <p style="margin-top: 30px;">If you have any questions or need assistance, our support team is here to help.</p>
            
            <p style="margin-top: 20px;">Best regards,<br><strong class="brand">Placify Team</strong></p>
          </div>

          <div class="footer">
            <div class="social-links">
              <a href="#">in</a>
              <a href="#">f</a>
              <a href="#">t</a>
            </div>
            <p>This email was sent to <strong>${email}</strong></p>
            <p>If you didn't create this account, please <a href="#">contact us</a> immediately.</p>
            <p style="margin-top: 20px;">
              <a href="#">Privacy Policy</a> &nbsp;|&nbsp; 
              <a href="#">Terms of Service</a> &nbsp;|&nbsp; 
              <a href="#">Help Center</a>
            </p>
            <p style="margin-top: 20px; color: #aaa;">&copy; 2026 <span class="brand">Placify</span>. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  otpEmailTemplate,
  passwordResetSuccessTemplate,
  welcomeEmailTemplate,
  registrationConfirmationTemplate
};
