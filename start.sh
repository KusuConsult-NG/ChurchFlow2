#!/bin/bash

echo "🚀 Setting up ChurchFlow Application..."

# Clean up any existing build artifacts
echo "🧹 Cleaning up build artifacts..."
rm -rf .next
rm -rf node_modules

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    
    # Start the development server
    echo "🎯 Starting development server..."
    echo "📱 The application will be available at: http://localhost:3000"
    echo "🔑 Login credentials:"
    echo "   Email: admin@churchflow.com"
    echo "   Password: password"
    echo ""
    echo "Press Ctrl+C to stop the server"
    
    npm run dev
else
    echo "❌ Failed to install dependencies. Please check your Node.js installation."
    exit 1
fi
