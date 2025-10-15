# ChurchFlow - ECWA Financial Management System

A comprehensive financial and organizational management system built for ECWA (Evangelical Church Winning All) with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd /Users/mac/Downloads/churchflow2
   ```

2. **Run the setup script:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

5. **Login with mock credentials:**
   - Email: `admin@churchflow.com`
   - Password: `password`

## 🏗️ Architecture

### Frontend
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom components with Radix UI primitives
- **State Management:** React Context API
- **Authentication:** JWT-based with localStorage

### Backend
- **API Routes:** Next.js API routes
- **Database:** In-memory mock database (replace with real DB in production)
- **Authentication:** JWT tokens
- **Currency:** Nigerian Naira (₦)

## 📁 Project Structure

```
churchflow2/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── dashboard/     # Dashboard data
│   │   │   ├── expenditures/ # Expenditure management
│   │   │   ├── income/        # Income management
│   │   │   ├── hr/            # HR management
│   │   │   ├── accounts/      # Account management
│   │   │   └── organizations/ # Organization management
│   │   ├── dashboard/         # Dashboard page
│   │   ├── expenditures/      # Expenditure pages
│   │   ├── income/           # Income pages
│   │   ├── approvals/        # Approval pages
│   │   ├── hr/               # HR pages
│   │   ├── organizations/    # Organization pages
│   │   ├── accounts/         # Account pages
│   │   ├── reports/          # Report pages
│   │   ├── settings/         # Settings pages
│   │   ├── auth/             # Authentication pages
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── layout/           # Layout components
│   │   └── ui/               # UI primitives
│   ├── context/              # React contexts
│   └── lib/                  # Utilities and API client
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration  
- `GET /api/auth/verify` - Verify JWT token

### Dashboard
- `GET /api/dashboard` - Get dashboard metrics and recent data

### Expenditures
- `GET /api/expenditures` - Get all expenditures
- `POST /api/expenditures` - Create new expenditure
- `GET /api/expenditures/[id]` - Get expenditure by ID
- `PUT /api/expenditures/[id]` - Update expenditure

### Income
- `GET /api/income` - Get all income records
- `POST /api/income` - Create new income record

### HR Management
- `GET /api/hr/staff` - Get all staff members
- `POST /api/hr/staff` - Create new staff member

### Accounts
- `GET /api/accounts` - Get all accounts
- `POST /api/accounts` - Create new account

### Organizations
- `GET /api/organizations` - Get all organizations
- `POST /api/organizations` - Create new organization

## 💰 Currency & Formatting

All monetary amounts are displayed in **Nigerian Naira (₦)** using the `Intl.NumberFormat` API:

```typescript
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount)
}
```

## 🔐 Authentication Flow

1. **Login:** User submits credentials to `/api/auth/signin`
2. **Token Generation:** Server generates JWT token
3. **Storage:** Token stored in localStorage
4. **Verification:** Token verified on each API request
5. **Logout:** Token removed from localStorage

### Mock Authentication
For development, the system uses mock authentication:
- **Email:** `admin@churchflow.com`
- **Password:** `password`

## 📊 Data Models

### User
```typescript
interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: string
  organizationId: string
  password: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Organization
```typescript
interface Organization {
  id: string
  name: string
  type: 'GCC' | 'DCC' | 'LCC' | 'LC'
  parentId?: string
  address?: string
  phone?: string
  email?: string
  secretaryName?: string
  secretaryEmail?: string
  secretaryPhone?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Expenditure
```typescript
interface Expenditure {
  id: string
  title: string
  description: string
  amount: number
  type: 'general' | 'agency' | 'project' | 'maintenance' | 'event'
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'disbursed'
  requestedBy: string
  organizationId: string
  agencyId?: string
  bankName?: string
  accountNumber?: string
  beneficiaryName?: string
  approvalFlow: ApprovalStep[]
  createdAt: Date
  updatedAt: Date
}
```

## 🎨 UI/UX Features

### Design System
- **Primary Color:** #000052 (Deep Blue)
- **Secondary Color:** #ffffff (White)
- **Sidebar Navigation:** Collapsible with icons
- **Responsive Design:** Mobile-first approach
- **Dark Mode:** Disabled for form readability

### Components
- **Cards:** Consistent card layouts
- **Buttons:** Multiple variants (primary, secondary, outline, ghost)
- **Forms:** Enhanced input fields with proper validation
- **Tables:** Sortable and filterable data tables
- **Modals:** Overlay dialogs for forms and confirmations

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Setup
./setup.sh           # Complete setup script
```

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

## 🔒 Security Features

- JWT token authentication
- Input validation and sanitization
- CORS protection
- Rate limiting (to be implemented)
- Audit logging (to be implemented)

## 🚀 Production Deployment

### Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
```

### Database Migration
Replace the mock database (`src/lib/database.ts`) with a real database:
- PostgreSQL with Prisma ORM
- MongoDB with Mongoose
- MySQL with Sequelize

### Deployment Platforms
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**ChurchFlow** - Empowering ECWA with modern financial management tools. 🏛️✨