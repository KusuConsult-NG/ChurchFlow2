#!/bin/bash

# ChurchFlow SendGrid Email Setup Script
# This script helps you set up SendGrid email functionality

echo "📧 Setting up SendGrid Email for ChurchFlow..."

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# SendGrid Email Configuration
SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY
FROM_EMAIL=noreply@churchflow.com
FROM_NAME=ChurchFlow

# Google OAuth Configuration
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Database (if using Prisma)
DATABASE_URL="file:./dev.db"

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
EOF
    echo "✅ .env.local file created successfully!"
else
    echo "⚠️  .env.local file already exists. Please update it manually with the SendGrid API key."
fi

# Install SendGrid package
echo "📦 Installing SendGrid package..."
npm install @sendgrid/mail

echo ""
echo "🔧 Next steps:"
echo "1. Verify your SendGrid sender identity (email domain or single sender)"
echo "2. Test email functionality by:"
echo "   - Going to the signin page"
echo "   - Clicking 'Forgot your password?'"
echo "   - Entering an email address"
echo "3. Check your email for the password reset link"
echo ""
echo "📋 Email Features Available:"
echo "✅ Password reset emails"
echo "✅ Welcome emails for new users"
echo "✅ Expenditure approval notifications"
echo "✅ General notification emails"
echo ""
echo "🎉 SendGrid email setup complete!"
