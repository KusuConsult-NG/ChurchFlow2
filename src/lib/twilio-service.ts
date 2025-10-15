import twilio from 'twilio'

// Lazy initialization of Twilio client
let client: any = null

const getTwilioClient = () => {
  if (!client) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    
    if (!accountSid || !authToken || accountSid === 'YOUR_TWILIO_ACCOUNT_SID' || authToken === 'YOUR_TWILIO_AUTH_TOKEN') {
      throw new Error('Twilio credentials not properly configured')
    }
    
    client = twilio(accountSid, authToken)
  }
  return client
}

const FROM_PHONE = process.env.TWILIO_PHONE_NUMBER || 'YOUR_TWILIO_PHONE_NUMBER'

export interface SMSResult {
  success: boolean
  messageId?: string
  error?: string
}

export interface SMSOptions {
  to: string
  message: string
  from?: string
}

export class TwilioService {
  /**
   * Send SMS message
   */
  static async sendSMS(options: SMSOptions): Promise<SMSResult> {
    // Development mode fallback
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV MODE] SMS would be sent to ${options.to}: ${options.message}`)
      return {
        success: true,
        messageId: 'dev-sms-' + Date.now()
      }
    }

    try {
      const twilioClient = getTwilioClient()
      const message = await twilioClient.messages.create({
        body: options.message,
        from: options.from || FROM_PHONE,
        to: options.to
      })

      return {
        success: true,
        messageId: message.sid
      }
    } catch (error: any) {
      console.error('SMS sending failed:', error)
      
      // Handle trial account limitations
      if (error.code === 21608) {
        console.warn('Trial account limitation: Cannot send SMS to unverified numbers')
        return {
          success: false,
          error: 'Trial account limitation: Please verify the phone number or upgrade your Twilio account'
        }
      }
      
      return {
        success: false,
        error: error.message || 'Failed to send SMS'
      }
    }
  }

  /**
   * Send two-factor authentication code
   */
  static async send2FACode(phoneNumber: string, code: string): Promise<SMSResult> {
    const message = `Your ChurchFlow verification code is: ${code}. This code expires in 10 minutes. Do not share this code with anyone.`
    
    return this.sendSMS({
      to: phoneNumber,
      message
    })
  }

  /**
   * Send password reset SMS
   */
  static async sendPasswordResetSMS(phoneNumber: string, resetCode: string): Promise<SMSResult> {
    const message = `Your ChurchFlow password reset code is: ${resetCode}. This code expires in 15 minutes. If you didn't request this, please ignore this message.`
    
    return this.sendSMS({
      to: phoneNumber,
      message
    })
  }

  /**
   * Send expenditure approval notification
   */
  static async sendExpenditureApprovalSMS(phoneNumber: string, expenditure: any): Promise<SMSResult> {
    const message = `New expenditure request requires your approval: ${expenditure.title} - ₦${expenditure.amount.toLocaleString()}. Please review in ChurchFlow.`
    
    return this.sendSMS({
      to: phoneNumber,
      message
    })
  }

  /**
   * Send welcome SMS
   */
  static async sendWelcomeSMS(phoneNumber: string, firstName: string): Promise<SMSResult> {
    const message = `Welcome to ChurchFlow, ${firstName}! Your account has been created successfully. You can now access the financial management system.`
    
    return this.sendSMS({
      to: phoneNumber,
      message
    })
  }

  /**
   * Send login notification
   */
  static async sendLoginNotificationSMS(phoneNumber: string, loginTime: string, deviceInfo?: string): Promise<SMSResult> {
    const deviceText = deviceInfo ? ` from ${deviceInfo}` : ''
    const message = `Your ChurchFlow account was accessed${deviceText} at ${loginTime}. If this wasn't you, please secure your account immediately.`
    
    return this.sendSMS({
      to: phoneNumber,
      message
    })
  }

  /**
   * Send account security alert
   */
  static async sendSecurityAlertSMS(phoneNumber: string, alertType: string, details?: string): Promise<SMSResult> {
    let message = `Security Alert: ${alertType} detected on your ChurchFlow account.`
    if (details) {
      message += ` Details: ${details}`
    }
    message += ' Please review your account security settings.'
    
    return this.sendSMS({
      to: phoneNumber,
      message
    })
  }

  /**
   * Send monthly report notification
   */
  static async sendMonthlyReportSMS(phoneNumber: string, reportData: any): Promise<SMSResult> {
    const message = `Your monthly ChurchFlow report is ready. Total Income: ₦${reportData.totalIncome.toLocaleString()}, Total Expenses: ₦${reportData.totalExpenses.toLocaleString()}. View full report in the app.`
    
    return this.sendSMS({
      to: phoneNumber,
      message
    })
  }

  /**
   * Send payment reminder
   */
  static async sendPaymentReminderSMS(phoneNumber: string, amount: number, dueDate: string): Promise<SMSResult> {
    const message = `Payment Reminder: ₦${amount.toLocaleString()} is due on ${dueDate}. Please ensure payment is made on time to avoid any issues.`
    
    return this.sendSMS({
      to: phoneNumber,
      message
    })
  }

  /**
   * Send custom notification
   */
  static async sendCustomNotificationSMS(phoneNumber: string, title: string, message: string): Promise<SMSResult> {
    const fullMessage = `${title}: ${message} - ChurchFlow`
    
    return this.sendSMS({
      to: phoneNumber,
      message: fullMessage
    })
  }

  /**
   * Validate phone number format
   */
  static validatePhoneNumber(phoneNumber: string): boolean {
    // Basic phone number validation (E.164 format)
    const phoneRegex = /^\+[1-9]\d{1,14}$/
    return phoneRegex.test(phoneNumber)
  }

  /**
   * Format phone number to E.164 format
   */
  static formatPhoneNumber(phoneNumber: string, countryCode: string = '+234'): string {
    // Remove all non-digit characters
    const digits = phoneNumber.replace(/\D/g, '')
    
    // If already starts with country code, return as is
    if (phoneNumber.startsWith('+')) {
      return phoneNumber
    }
    
    // Add country code if not present
    if (digits.startsWith(countryCode.replace('+', ''))) {
      return `+${digits}`
    }
    
    return `${countryCode}${digits}`
  }

  /**
   * Generate random verification code
   */
  static generateVerificationCode(length: number = 6): string {
    const digits = '0123456789'
    let code = ''
    for (let i = 0; i < length; i++) {
      code += digits[Math.floor(Math.random() * digits.length)]
    }
    return code
  }

  /**
   * Check SMS delivery status
   */
  static async getMessageStatus(messageId: string): Promise<any> {
    try {
      const twilioClient = getTwilioClient()
      const message = await twilioClient.messages(messageId).fetch()
      return {
        success: true,
        status: message.status,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Get account balance
   */
  static async getAccountBalance(): Promise<any> {
    try {
      const twilioClient = getTwilioClient()
      const balance = await twilioClient.balance.fetch()
      return {
        success: true,
        balance: balance.balance,
        currency: balance.currency
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

export default TwilioService
