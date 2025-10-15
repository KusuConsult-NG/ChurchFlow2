#!/bin/bash

echo "🚀 Starting ChurchFlow Application Setup..."
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
print_status "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js version: $NODE_VERSION"

# Check if npm is installed
print_status "Checking npm installation..."
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm and try again."
    exit 1
fi

NPM_VERSION=$(npm --version)
print_success "npm version: $NPM_VERSION"

# Clean up existing build artifacts
print_status "Cleaning up existing build artifacts..."
rm -rf .next
rm -rf node_modules
rm -f package-lock.json
print_success "Cleanup completed"

# Install dependencies
print_status "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    print_status "Creating environment file..."
    cat > .env.local << EOF
# ChurchFlow Environment Variables
NEXT_PUBLIC_API_URL=
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
EOF
    print_success "Environment file created"
else
    print_warning "Environment file already exists"
fi

# Create .env.example file
print_status "Creating example environment file..."
cat > .env.example << EOF
# ChurchFlow Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
EOF
print_success "Example environment file created"

# Build the application
print_status "Building the application..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Application built successfully"
else
    print_warning "Build failed, but continuing with development mode"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo "=========================================="
echo ""
echo "📋 Next Steps:"
echo "1. Start the development server: npm run dev"
echo "2. Open your browser to: http://localhost:3000"
echo "3. Login with: admin@churchflow.com / password"
echo ""
echo "🔧 Available Commands:"
echo "• npm run dev     - Start development server"
echo "• npm run build   - Build for production"
echo "• npm run start   - Start production server"
echo "• npm run lint    - Run ESLint"
echo ""
echo "📁 Project Structure:"
echo "• src/app/        - Next.js pages and API routes"
echo "• src/components/ - React components"
echo "• src/lib/        - Utility functions and API client"
echo "• src/context/    - React context providers"
echo ""
echo "🌐 API Endpoints:"
echo "• POST /api/auth/signin    - User login"
echo "• POST /api/auth/signup    - User registration"
echo "• GET  /api/auth/verify    - Verify token"
echo "• GET  /api/dashboard      - Dashboard data"
echo "• GET  /api/expenditures   - Get expenditures"
echo "• POST /api/expenditures   - Create expenditure"
echo "• GET  /api/income         - Get income records"
echo "• POST /api/income         - Create income record"
echo "• GET  /api/hr/staff       - Get staff members"
echo "• POST /api/hr/staff       - Create staff member"
echo "• GET  /api/accounts       - Get accounts"
echo "• POST /api/accounts       - Create account"
echo "• GET  /api/organizations  - Get organizations"
echo "• POST /api/organizations - Create organization"
echo ""
echo "💰 Currency: All amounts are displayed in Nigerian Naira (₦)"
echo "🔐 Authentication: JWT-based with mock data for development"
echo "📊 Database: In-memory mock database (replace with real DB in production)"
echo ""
print_success "Ready to start development! Run 'npm run dev' to begin."
