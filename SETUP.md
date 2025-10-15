# ChurchFlow - ECWA Financial Management System

A comprehensive financial and organizational management system for ECWA churches.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clean and Install Dependencies**
   ```bash
   rm -rf .next node_modules
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Open your browser to `http://localhost:3000`
   - Login with:
     - **Email**: `admin@churchflow.com`
     - **Password**: `password`

## 📱 Available Pages

### Core Features
- **Dashboard** (`/dashboard`) - Main overview with statistics
- **Expenditures** (`/expenditures`) - Manage expenditure requests and approvals
- **Income** (`/income`) - Record and track church income
- **Approvals** (`/approvals`) - Review and approve pending requests
- **HR Management** (`/hr`) - Staff management, payroll, leave requests
- **Organizations** (`/organizations`) - Manage church hierarchy (GCC→DCC→LCC→LC)
- **Accounts** (`/accounts`) - Financial account management
- **Reports** (`/reports`) - Generate various reports
- **Settings** (`/settings`) - User and system settings

### Authentication
- **Sign In** (`/auth/signin`) - User login
- **Sign Up** (`/auth/signup`) - User registration

## 🎨 Features

### UI/UX
- **ChurchFlow Branding** - Custom colors (#000052, #ffffff)
- **Responsive Design** - Works on all devices
- **Sidebar Navigation** - Collapsible menu system
- **Role-based Access** - Different views for different roles
- **Interactive Forms** - Comprehensive data entry forms
- **Status Tracking** - Real-time status updates

### Functionality
- **Organization Hierarchy** - Complete GCC→DCC→LCC→LC structure
- **Role-based Access Control** - Granular permissions
- **Expenditure Workflows** - Multi-step approval processes
- **HR Management** - Staff, payroll, leave management
- **Audit Trail** - Complete activity logging
- **Financial Management** - Income, expenditure, account tracking
- **Reporting System** - Custom report generation

## 🛠️ Technical Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context
- **Authentication**: Mock system (ready for backend integration)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── expenditures/      # Expenditure management
│   ├── income/            # Income management
│   ├── approvals/         # Approval system
│   ├── hr/                # HR management
│   ├── organizations/     # Organization management
│   ├── accounts/          # Account management
│   ├── reports/           # Reporting system
│   ├── settings/          # Settings page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── context/              # React context providers
├── lib/                  # Utility functions
└── types/                # TypeScript type definitions
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Mock Data
The application uses mock data for development. All pages are fully functional with:
- Sample organizations, users, and roles
- Mock financial data
- Simulated approval workflows
- Test transactions and reports

## 🚀 Deployment

The application is ready for deployment to:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any Node.js hosting platform

## 📞 Support

For issues or questions:
1. Check the console for error messages
2. Ensure all dependencies are installed
3. Verify Node.js version compatibility
4. Clear browser cache if experiencing issues

## 🎯 Next Steps

1. **Backend Integration** - Connect to a real database and API
2. **Authentication** - Implement proper OAuth and JWT
3. **Email Notifications** - Add email service integration
4. **File Uploads** - Implement file storage for documents
5. **Mobile App** - Create React Native version
6. **Advanced Reporting** - Add charts and analytics

---

**ChurchFlow** - Empowering ECWA churches with modern financial management tools.
