#!/bin/bash

# ChurchFlow Google OAuth Setup Script
# This script helps you set up Google OAuth authentication

echo "🚀 Setting up Google OAuth for ChurchFlow..."

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
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
    echo "⚠️  .env.local file already exists. Please update it manually with the Google OAuth credentials."
fi

echo ""
echo "🔧 Next steps:"
echo "1. Make sure your Google OAuth app is configured with these redirect URIs:"
echo "   - http://localhost:3000/api/auth/callback/google"
echo "   - https://yourdomain.com/api/auth/callback/google (for production)"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. Test Google OAuth by clicking 'Sign in with Google' on the signin page"
echo ""
echo "🎉 Google OAuth setup complete!"
