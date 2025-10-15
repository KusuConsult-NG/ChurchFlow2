# ChurchFlow Installation Guide

## Manual Installation Steps

Due to shell environment issues, please follow these steps manually:

### 1. Navigate to the Project Directory
```bash
cd /Users/mac/Downloads/churchflow2
```

### 2. Clear Any Existing Cache (if needed)
```bash
rm -rf .next
rm -rf node_modules
rm -f package-lock.json
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```

### 5. Access the Application
Open your browser and go to: `http://localhost:3000`

## Default Login Credentials
- **Email**: `admin@churchflow.com`
- **Password**: `password`

## Project Structure Created

✅ **Core Application Files**
- `package.json` - Project configuration with all dependencies
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS with ChurchFlow colors
- `postcss.config.js` - PostCSS configuration

✅ **Source Code Structure**
- `src/app/` - Next.js app directory
  - `layout.tsx` - Root layout with sidebar and topbar
  - `page.tsx` - Homepage with ChurchFlow features
  - `globals.css` - Global styles with ChurchFlow theme
  - `auth/signin/page.tsx` - Sign in page with Google OAuth
  - `auth/signup/page.tsx` - Sign up page with organization details
  - `dashboard/page.tsx` - Role-based dashboard
  - `api/auth/` - Authentication API routes

- `src/components/` - React components
  - `ui/` - Reusable UI components (Button, Card, Input)
  - `layout/` - Layout components (Sidebar, Topbar)

- `src/context/` - React context providers
  - `AuthContext.tsx` - Authentication state management

- `src/lib/` - Utility functions
  - `utils.ts` - Utility functions including `cn` helper

## Features Implemented

### ✅ Authentication System
- Email/password authentication
- Google OAuth integration
- User registration with organization details
- Token-based authentication
- User context management

### ✅ UI/UX Design
- ChurchFlow colors (#000052 primary, #ffffff secondary)
- Sidebar navigation with collapsible menus
- Topbar with user ID display and logout
- Responsive design with Tailwind CSS
- Consistent component styling

### ✅ Navigation Structure
- Dashboard
- Expenditures (New Request, Pending, Approved, History)
- Income (Record Income, Tithe & Offering, Donations, History)
- Approvals
- HR Management (Staff, Payroll, Leave, Queries)
- Organizations (Create, Manage Leaders, Agencies & Groups)
- Accounts (New Account, View History, Generate Statements)
- Reports (Financial, Audit, HR)
- Settings

### ✅ Organization Support
- GCC, DCC, LCC, LC organization types
- Role-based access control structure
- Organization creation workflow

## Next Steps After Installation

1. **Test the Application**: Verify all pages load correctly
2. **Test Authentication**: Try signing in with default credentials
3. **Test Navigation**: Click through all sidebar menu items
4. **Test Google OAuth**: Try the Google sign-in button
5. **Verify User Display**: Check that user ID appears in topbar

## Troubleshooting

If you encounter any issues:

1. **Port Already in Use**: The app will automatically use the next available port
2. **Build Errors**: Clear `.next` directory and try again
3. **Dependency Issues**: Delete `node_modules` and `package-lock.json`, then run `npm install`

## Dependencies Included

- **Next.js 15.5.5** - React framework
- **React 18.3.1** - UI library
- **TypeScript 5.6.3** - Type safety
- **Tailwind CSS 3.4.15** - Styling
- **Lucide React 0.468.0** - Icons
- **Framer Motion 11.15.0** - Animations
- **Next Auth 4.24.10** - Authentication
- **Prisma 5.22.0** - Database ORM
- **Class Variance Authority** - Component variants
- **Radix UI** - Accessible components

The application is ready to run once dependencies are installed!