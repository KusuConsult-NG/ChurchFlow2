# SendGrid Email Integration Setup Guide

## Overview
This guide explains how to set up SendGrid email functionality for ChurchFlow using the provided API key.

## Provided SendGrid API Key
- **API Key**: `YOUR_SENDGRID_API_KEY`

## Setup Steps

### 1. Environment Variables
Create a `.env.local` file in the root directory with the following content:

```env
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

### 2. Install SendGrid Package
```bash
npm install @sendgrid/mail
```

### 3. Files Created/Modified

#### New Files:
- `src/lib/email-service.ts` - Email service utility with SendGrid integration
- `src/app/api/auth/reset-password/route.ts` - Password reset API endpoint
- `src/app/auth/reset-password/page.tsx` - Password reset page
- `setup-sendgrid.sh` - Setup script

#### Modified Files:
- `src/app/auth/signin/page.tsx` - Added "Forgot Password" link

### 4. Email Features Implemented

#### Password Reset Flow:
1. User clicks "Forgot your password?" on signin page
2. User enters email address
3. System sends password reset email via SendGrid
4. User clicks link in email
5. User sets new password
6. User is redirected to signin page

#### Email Templates Available:
- **Password Reset**: Professional HTML template with ChurchFlow branding
- **Welcome Email**: Welcome message for new users
- **Expenditure Approval**: Notification for expenditure approval requests
- **General Notifications**: Custom notification emails

### 5. Email Service Features

#### EmailService Class Methods:
```typescript
// Send password reset email
await EmailService.sendPasswordResetEmail(email, resetToken)

// Send welcome email
await EmailService.sendWelcomeEmail(email, firstName)

// Send expenditure approval notification
await EmailService.sendExpenditureApprovalEmail(email, expenditure)

// Send general notification
await EmailService.sendNotificationEmail(email, subject, message)
```

#### Email Template Features:
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **ChurchFlow Branding**: Consistent with app design
- ✅ **Professional Styling**: Clean, modern appearance
- ✅ **Security**: Secure token handling for password resets
- ✅ **Accessibility**: Proper HTML structure and alt text

### 6. Testing Email Functionality

#### Test Password Reset:
1. Start the development server: `npm run dev`
2. Navigate to `/auth/signin`
3. Click "Forgot your password?"
4. Enter an email address
5. Check your email for the reset link
6. Click the link and set a new password

#### Test Other Email Features:
- Sign up a new user (triggers welcome email)
- Create an expenditure request (triggers approval email)
- Use the notification API for custom emails

### 7. SendGrid Configuration

#### Sender Authentication:
1. **Single Sender Verification**: Verify `noreply@churchflow.com`
2. **Domain Authentication**: Verify your domain for better deliverability
3. **DKIM Setup**: Configure DKIM for email authentication

#### SendGrid Dashboard:
- Monitor email delivery rates
- Track email opens and clicks
- Manage suppression lists
- View email templates

### 8. Production Deployment

#### Environment Variables:
```env
SENDGRID_API_KEY=your-production-api-key
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=ChurchFlow
NEXTAUTH_URL=https://yourdomain.com
```

#### Security Considerations:
- Use environment variables for API keys
- Implement rate limiting for password reset requests
- Set appropriate token expiration times
- Monitor for abuse and spam

### 9. Email Templates Customization

#### Template Structure:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Title - ChurchFlow</title>
  <style>
    /* Responsive CSS styles */
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ChurchFlow</h1>
      <p>Financial Management System</p>
    </div>
    <div class="content">
      <!-- Email content -->
    </div>
    <div class="footer">
      <p>© 2024 ChurchFlow. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

#### Customization Options:
- Update colors to match your brand
- Modify content and messaging
- Add your logo and branding
- Adjust layout and styling

### 10. Troubleshooting

#### Common Issues:

**"Email not sending"**
- Check SendGrid API key is correct
- Verify sender email is authenticated
- Check SendGrid account status

**"Invalid API key"**
- Verify API key format
- Check API key permissions
- Ensure key is not expired

**"Email going to spam"**
- Set up SPF, DKIM, and DMARC records
- Use authenticated sender domain
- Avoid spam trigger words

**"Template not rendering"**
- Check HTML syntax
- Verify CSS is inline or embedded
- Test with different email clients

### 11. Monitoring and Analytics

#### SendGrid Analytics:
- Delivery rates
- Open rates
- Click rates
- Bounce rates
- Spam reports

#### Custom Tracking:
- Track password reset usage
- Monitor email engagement
- Analyze user behavior
- Optimize email content

### 12. Security Best Practices

#### Password Reset Security:
- Use secure random tokens
- Set token expiration (1 hour)
- Limit reset attempts per email
- Log all reset attempts

#### Email Security:
- Validate email addresses
- Sanitize user input
- Use HTTPS for all links
- Implement rate limiting

## Support

If you encounter any issues with SendGrid integration:
1. Check SendGrid dashboard for delivery status
2. Verify environment variables
3. Test with different email addresses
4. Check browser console for errors
5. Review SendGrid documentation
