# Twilio SMS Integration Setup Guide

## Overview
This guide explains how to set up Twilio SMS functionality for ChurchFlow using the provided credentials.

## Provided Twilio Credentials
- **Account SID**: `YOUR_TWILIO_ACCOUNT_SID`
- **Auth Token**: `YOUR_TWILIO_AUTH_TOKEN`
- **Phone Number**: `YOUR_TWILIO_PHONE_NUMBER`

## Setup Steps

### 1. Environment Variables
Create a `.env.local` file in the root directory with the following content:

```env
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER=YOUR_TWILIO_PHONE_NUMBER

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=df7zxiuxq
CLOUDINARY_API_KEY=694375151875773
CLOUDINARY_API_SECRET=H_49Pm6D97aSoHAoE7G4Gj0vIFI

# SendGrid Email Configuration
SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY
FROM_EMAIL=noreply@churchflow.com
FROM_NAME=ChurchFlow

# Google OAuth Configuration
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

# Database (if using Prisma)
DATABASE_URL="file:./dev.db"

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Install Twilio Package
```bash
npm install twilio
```

### 3. Files Created/Modified

#### New Files:
- `src/lib/twilio-service.ts` - Twilio SMS service utility
- `src/app/api/auth/verify-sms/route.ts` - SMS verification API endpoint
- `src/app/api/notifications/sms/route.ts` - SMS notifications API endpoint
- `src/app/auth/two-factor/page.tsx` - Two-factor authentication page
- `setup-twilio.sh` - Setup script

#### Modified Files:
- `src/app/settings/page.tsx` - Added phone number field and SMS preferences

### 4. SMS Features Implemented

#### Two-Factor Authentication:
- SMS-based verification codes
- 6-digit random codes
- 10-minute expiration
- 3 attempt limit
- Resend functionality with countdown

#### Password Reset:
- SMS-based password reset codes
- 15-minute expiration
- Secure code generation
- Phone number validation

#### Notification Types:
- **Welcome SMS**: New user onboarding
- **Expenditure Approval**: Approval request notifications
- **Login Notifications**: Security alerts for account access
- **Security Alerts**: Suspicious activity notifications
- **Monthly Reports**: Financial summary notifications
- **Payment Reminders**: Due payment notifications
- **Custom Notifications**: User-defined messages

### 5. TwilioService Class Methods

```typescript
// Send basic SMS
await TwilioService.sendSMS({ to: phoneNumber, message: 'Hello' })

// Send 2FA code
await TwilioService.send2FACode(phoneNumber, code)

// Send password reset SMS
await TwilioService.sendPasswordResetSMS(phoneNumber, resetCode)

// Send expenditure approval notification
await TwilioService.sendExpenditureApprovalSMS(phoneNumber, expenditure)

// Send welcome SMS
await TwilioService.sendWelcomeSMS(phoneNumber, firstName)

// Send login notification
await TwilioService.sendLoginNotificationSMS(phoneNumber, loginTime, deviceInfo)

// Send security alert
await TwilioService.sendSecurityAlertSMS(phoneNumber, alertType, details)

// Send monthly report
await TwilioService.sendMonthlyReportSMS(phoneNumber, reportData)

// Send payment reminder
await TwilioService.sendPaymentReminderSMS(phoneNumber, amount, dueDate)

// Send custom notification
await TwilioService.sendCustomNotificationSMS(phoneNumber, title, message)

// Validate phone number
TwilioService.validatePhoneNumber(phoneNumber)

// Format phone number
TwilioService.formatPhoneNumber(phoneNumber, countryCode)

// Generate verification code
TwilioService.generateVerificationCode(length)

// Check message status
await TwilioService.getMessageStatus(messageId)

// Get account balance
await TwilioService.getAccountBalance()
```

### 6. API Endpoints

#### Send Verification Code
```http
POST /api/auth/verify-sms
Content-Type: application/json

{
  "phoneNumber": "+2348012345678",
  "action": "two_factor" | "password_reset"
}
```

#### Verify Code
```http
PUT /api/auth/verify-sms
Content-Type: application/json

{
  "phoneNumber": "+2348012345678",
  "code": "123456",
  "action": "two_factor" | "password_reset"
}
```

#### Send SMS Notification
```http
POST /api/notifications/sms
Content-Type: application/json

{
  "phoneNumber": "+2348012345678",
  "type": "welcome" | "expenditure_approval" | "login_notification" | "security_alert" | "monthly_report" | "payment_reminder" | "custom",
  "data": { ... }
}
```

#### Check Message Status
```http
GET /api/notifications/sms?messageId=MESSAGE_SID
```

#### Get Account Balance
```http
GET /api/notifications/sms?action=balance
```

### 7. Two-Factor Authentication Flow

#### Setup Flow:
1. User enters phone number
2. System sends verification code via SMS
3. User enters 6-digit code
4. System verifies code and enables 2FA
5. User is redirected to dashboard

#### Login Flow:
1. User enters credentials
2. System prompts for 2FA
3. User enters phone number
4. System sends verification code
5. User enters code to complete login

### 8. Phone Number Formatting

#### Supported Formats:
- **E.164 Format**: `+2348012345678` (recommended)
- **Local Format**: `08012345678` (automatically formatted)
- **International Format**: `+234 801 234 5678`

#### Country Codes:
- **Nigeria**: `+234` (default)
- **USA**: `+1`
- **UK**: `+44`
- **Custom**: Specify in function call

### 9. Testing SMS Functionality

#### Test Two-Factor Authentication:
1. Start the development server: `npm run dev`
2. Navigate to `/auth/two-factor`
3. Enter a valid phone number
4. Check your phone for the verification code
5. Enter the code to verify

#### Test SMS Notifications:
1. Go to Settings > Notifications
2. Enable SMS notifications
3. Add your phone number
4. Trigger various notification types
5. Check your phone for messages

### 10. Twilio Console Management

#### Account Dashboard:
- Monitor SMS usage and costs
- View message delivery statistics
- Check account balance
- Manage phone numbers

#### Message Logs:
- View sent and received messages
- Check delivery status
- Monitor error rates
- Debug failed messages

#### Phone Number Management:
- Purchase additional numbers
- Configure webhooks
- Set up call forwarding
- Manage messaging settings

### 11. Security Considerations

#### Code Security:
- **Expiration Times**: 10 minutes for 2FA, 15 minutes for password reset
- **Attempt Limits**: Maximum 3 attempts per code
- **Rate Limiting**: Prevent spam and abuse
- **Secure Storage**: Temporary code storage

#### Phone Number Security:
- **Validation**: E.164 format validation
- **Privacy**: No permanent storage of codes
- **Access Control**: User-specific verification
- **Audit Trail**: Log all verification attempts

### 12. Error Handling

#### Common Errors:
- **Invalid Phone Number**: Format validation failed
- **Code Expired**: Verification code has expired
- **Too Many Attempts**: Exceeded attempt limit
- **SMS Failed**: Twilio delivery failure
- **Invalid Code**: Incorrect verification code

#### Error Recovery:
- Clear error messages
- Retry mechanisms
- Fallback options
- User guidance

### 13. Performance Optimization

#### Message Delivery:
- **Async Processing**: Non-blocking SMS sending
- **Queue Management**: Handle high volume
- **Retry Logic**: Automatic retry on failure
- **Rate Limiting**: Prevent API abuse

#### Cost Optimization:
- **Message Length**: Optimize message content
- **Delivery Timing**: Schedule non-urgent messages
- **Bulk Operations**: Batch similar messages
- **Usage Monitoring**: Track costs and usage

### 14. Production Deployment

#### Environment Variables:
```env
TWILIO_ACCOUNT_SID=your-production-account-sid
TWILIO_AUTH_TOKEN=your-production-auth-token
TWILIO_PHONE_NUMBER=your-production-phone-number
```

#### Security Settings:
- Enable webhook validation
- Set up message logging
- Configure rate limiting
- Monitor usage and costs

### 15. Troubleshooting

#### Common Issues:

**"SMS not sending"**
- Check Twilio credentials
- Verify phone number format
- Check account balance
- Review Twilio console logs

**"Invalid phone number"**
- Ensure E.164 format
- Include country code
- Remove special characters
- Check number validity

**"Code not received"**
- Check phone number accuracy
- Verify carrier support
- Check spam/junk folders
- Try different phone number

**"Code expired"**
- Request new code
- Check system time
- Reduce expiration time
- Implement auto-refresh

### 16. Monitoring and Analytics

#### Twilio Analytics:
- Message delivery rates
- Delivery time statistics
- Error rate monitoring
- Cost tracking

#### Custom Tracking:
- Track verification success rates
- Monitor user engagement
- Analyze notification effectiveness
- Optimize message content

### 17. Best Practices

#### Message Content:
- Keep messages concise
- Use clear language
- Include relevant context
- Avoid spam triggers

#### User Experience:
- Provide clear instructions
- Show countdown timers
- Enable resend functionality
- Offer alternative methods

#### Security:
- Use strong verification codes
- Implement proper expiration
- Monitor for abuse
- Log all activities

## Support

If you encounter any issues with Twilio integration:
1. Check Twilio console for account status
2. Verify environment variables
3. Test with different phone numbers
4. Check browser console for errors
5. Review Twilio documentation
