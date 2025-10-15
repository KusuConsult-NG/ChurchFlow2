import { NextRequest, NextResponse } from 'next/server'
import TwilioService from '@/lib/twilio-service'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, type, data } = await request.json()

    if (!phoneNumber || !type) {
      return NextResponse.json(
        { error: 'Phone number and notification type are required' },
        { status: 400 }
      )
    }

    // Validate phone number format
    const formattedPhone = TwilioService.formatPhoneNumber(phoneNumber)
    if (!TwilioService.validatePhoneNumber(formattedPhone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    let smsResult

    // Send SMS based on notification type
    switch (type) {
      case 'welcome':
        smsResult = await TwilioService.sendWelcomeSMS(formattedPhone, data.firstName || 'User')
        break

      case 'expenditure_approval':
        smsResult = await TwilioService.sendExpenditureApprovalSMS(formattedPhone, data.expenditure)
        break

      case 'login_notification':
        smsResult = await TwilioService.sendLoginNotificationSMS(
          formattedPhone, 
          data.loginTime, 
          data.deviceInfo
        )
        break

      case 'security_alert':
        smsResult = await TwilioService.sendSecurityAlertSMS(
          formattedPhone, 
          data.alertType, 
          data.details
        )
        break

      case 'monthly_report':
        smsResult = await TwilioService.sendMonthlyReportSMS(formattedPhone, data.reportData)
        break

      case 'payment_reminder':
        smsResult = await TwilioService.sendPaymentReminderSMS(
          formattedPhone, 
          data.amount, 
          data.dueDate
        )
        break

      case 'custom':
        smsResult = await TwilioService.sendCustomNotificationSMS(
          formattedPhone, 
          data.title, 
          data.message
        )
        break

      default:
        return NextResponse.json(
          { error: 'Invalid notification type' },
          { status: 400 }
        )
    }

    if (!smsResult.success) {
      return NextResponse.json(
        { error: smsResult.error || 'Failed to send SMS notification' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'SMS notification sent successfully',
      messageId: smsResult.messageId
    })

  } catch (error) {
    console.error('SMS notification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('messageId')
    const action = searchParams.get('action')

    if (action === 'balance') {
      const balanceResult = await TwilioService.getAccountBalance()
      return NextResponse.json(balanceResult)
    }

    if (messageId) {
      const statusResult = await TwilioService.getMessageStatus(messageId)
      return NextResponse.json(statusResult)
    }

    return NextResponse.json({
      success: true,
      message: 'SMS service is operational'
    })

  } catch (error) {
    console.error('SMS service check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
