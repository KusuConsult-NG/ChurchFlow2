#!/bin/bash

# ChurchFlow Twilio SMS Setup Script
# This script helps you set up Twilio SMS functionality

echo "📱 Setting up Twilio SMS for ChurchFlow..."

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
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
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Database (if using Prisma)
DATABASE_URL="file:./dev.db"

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
EOF
    echo "✅ .env.local file created successfully!"
else
    echo "⚠️  .env.local file already exists. Please update it manually with the Twilio credentials."
fi

# Install Twilio package
echo "📦 Installing Twilio package..."
npm install twilio

echo ""
echo "🔧 Next steps:"
echo "1. Verify your Twilio account and phone number"
echo "2. Test SMS functionality by:"
echo "   - Going to Settings > Notifications"
echo "   - Enabling SMS notifications"
echo "   - Testing two-factor authentication"
echo "3. Check Twilio console for message delivery"
echo ""
echo "📋 SMS Features Available:"
echo "✅ Two-factor authentication"
echo "✅ Password reset via SMS"
echo "✅ Expenditure approval notifications"
echo "✅ Login security alerts"
echo "✅ Welcome messages"
echo "✅ Monthly report notifications"
echo "✅ Custom notifications"
echo ""
echo "🎉 Twilio SMS setup complete!"
