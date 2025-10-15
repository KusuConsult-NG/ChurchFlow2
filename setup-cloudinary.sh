#!/bin/bash

# ChurchFlow Cloudinary Setup Script
# This script helps you set up Cloudinary image upload functionality

echo "☁️  Setting up Cloudinary for ChurchFlow..."

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
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
    echo "⚠️  .env.local file already exists. Please update it manually with the Cloudinary credentials."
fi

# Install Cloudinary package
echo "📦 Installing Cloudinary package..."
npm install cloudinary

echo ""
echo "🔧 Next steps:"
echo "1. Verify your Cloudinary account settings"
echo "2. Test image upload functionality by:"
echo "   - Going to Settings > Profile"
echo "   - Uploading a profile picture"
echo "   - Checking if the image appears correctly"
echo ""
echo "📋 Image Upload Features Available:"
echo "✅ Profile picture uploads"
echo "✅ Organization logo uploads"
echo "✅ Document uploads"
echo "✅ Image transformations and optimization"
echo "✅ Automatic thumbnail generation"
echo "✅ Responsive image URLs"
echo ""
echo "🎉 Cloudinary setup complete!"
