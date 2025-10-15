import sgMail from '@sendgrid/mail'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

export interface EmailTemplate {
  to: string
  subject: string
  html: string
  text?: string
}

export class EmailService {
  private static fromEmail = process.env.FROM_EMAIL || 'noreply@churchflow.com'
  private static fromName = process.env.FROM_NAME || 'ChurchFlow'

  static async sendEmail(template: EmailTemplate) {
    try {
      const msg = {
        to: template.to,
        from: {
          email: this.fromEmail,
          name: this.fromName,
        },
        subject: template.subject,
        html: template.html,
        text: template.text || template.html.replace(/<[^>]*>/g, ''),
      }

      await sgMail.send(msg)
      console.log('Email sent successfully to:', template.to)
      return { success: true }
    } catch (error: any) {
      console.error('Email sending failed:', error)
      return { success: false, error: error.message || 'Unknown error' }
    }
  }

  static async sendPasswordResetEmail(email: string, resetToken: string) {
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
    
    const template: EmailTemplate = {
      to: email,
      subject: 'Reset Your ChurchFlow Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - ChurchFlow</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000052; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .button { 
              display: inline-block; 
              background: #000052; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>ChurchFlow</h1>
              <p>Financial Management System</p>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>Hello,</p>
              <p>We received a request to reset your password for your ChurchFlow account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p><a href="${resetUrl}">${resetUrl}</a></p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request this password reset, please ignore this email.</p>
              <p>Best regards,<br>The ChurchFlow Team</p>
            </div>
            <div class="footer">
              <p>© 2024 ChurchFlow. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    return this.sendEmail(template)
  }

  static async sendWelcomeEmail(email: string, firstName: string) {
    const template: EmailTemplate = {
      to: email,
      subject: 'Welcome to ChurchFlow!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome - ChurchFlow</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000052; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .button { 
              display: inline-block; 
              background: #000052; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>ChurchFlow</h1>
              <p>Financial Management System</p>
            </div>
            <div class="content">
              <h2>Welcome to ChurchFlow, ${firstName}!</h2>
              <p>Thank you for joining ChurchFlow, the comprehensive financial management system for churches.</p>
              <p>With ChurchFlow, you can:</p>
              <ul>
                <li>Manage expenditures and approvals</li>
                <li>Track income and donations</li>
                <li>Handle HR and staff management</li>
                <li>Generate comprehensive reports</li>
                <li>Organize your church hierarchy</li>
              </ul>
              <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">Get Started</a>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Best regards,<br>The ChurchFlow Team</p>
            </div>
            <div class="footer">
              <p>© 2024 ChurchFlow. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    return this.sendEmail(template)
  }

  static async sendExpenditureApprovalEmail(email: string, expenditure: any) {
    const template: EmailTemplate = {
      to: email,
      subject: `Expenditure Approval Required - ${expenditure.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Expenditure Approval - ChurchFlow</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000052; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .button { 
              display: inline-block; 
              background: #000052; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .expenditure-details { 
              background: white; 
              padding: 20px; 
              border-radius: 5px; 
              margin: 20px 0;
              border-left: 4px solid #000052;
            }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>ChurchFlow</h1>
              <p>Financial Management System</p>
            </div>
            <div class="content">
              <h2>Expenditure Approval Required</h2>
              <p>Hello,</p>
              <p>A new expenditure request requires your approval:</p>
              <div class="expenditure-details">
                <h3>${expenditure.title}</h3>
                <p><strong>Amount:</strong> ₦${expenditure.amount.toLocaleString()}</p>
                <p><strong>Type:</strong> ${expenditure.type}</p>
                <p><strong>Description:</strong> ${expenditure.description}</p>
                <p><strong>Requested by:</strong> ${expenditure.requestedBy}</p>
                <p><strong>Date:</strong> ${new Date(expenditure.createdAt).toLocaleDateString()}</p>
              </div>
              <a href="${process.env.NEXTAUTH_URL}/approvals" class="button">Review & Approve</a>
              <p>Please review this expenditure request and take appropriate action.</p>
              <p>Best regards,<br>The ChurchFlow Team</p>
            </div>
            <div class="footer">
              <p>© 2024 ChurchFlow. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    return this.sendEmail(template)
  }

  static async sendNotificationEmail(email: string, subject: string, message: string) {
    const template: EmailTemplate = {
      to: email,
      subject: `ChurchFlow Notification: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Notification - ChurchFlow</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000052; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>ChurchFlow</h1>
              <p>Financial Management System</p>
            </div>
            <div class="content">
              <h2>${subject}</h2>
              <p>${message}</p>
              <p>Best regards,<br>The ChurchFlow Team</p>
            </div>
            <div class="footer">
              <p>© 2024 ChurchFlow. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    return this.sendEmail(template)
  }
}

export default EmailService
