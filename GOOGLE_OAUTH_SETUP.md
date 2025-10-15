# Google OAuth Integration Setup Guide

## Overview
This guide explains how to set up Google OAuth authentication for ChurchFlow using the provided credentials.

## Provided Credentials
- **Client ID**: `YOUR_GOOGLE_CLIENT_ID`
- **Client Secret**: `YOUR_GOOGLE_CLIENT_SECRET`

## Setup Steps

### 1. Environment Variables
Create a `.env.local` file in the root directory with the following content:

```env
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

### 2. Google OAuth App Configuration
Make sure your Google OAuth application is configured with these redirect URIs:

**Development:**
- `http://localhost:3000/api/auth/callback/google`

**Production:**
- `https://yourdomain.com/api/auth/callback/google`

### 3. Files Created/Modified

#### New Files:
- `src/lib/auth.ts` - NextAuth configuration
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API route
- `src/app/api/auth/google/route.ts` - Google OAuth redirect handler
- `setup-google-oauth.sh` - Setup script

#### Modified Files:
- `src/context/AuthContext.tsx` - Updated to integrate with NextAuth
- `src/app/layout.tsx` - Added SessionProvider wrapper

### 4. Authentication Flow

#### Google OAuth Flow:
1. User clicks "Sign in with Google" button
2. Redirected to Google OAuth consent screen
3. User grants permissions
4. Google redirects back to `/api/auth/callback/google`
5. NextAuth processes the callback
6. User is redirected to dashboard

#### Fallback Authentication:
- Traditional email/password authentication still works
- Mock user data for development

### 5. User Data Mapping

When a user signs in with Google, their data is mapped as follows:

```typescript
{
  id: session.userId || session.user.email || 'google-user',
  email: session.user.email || '',
  name: session.user.name || '',
  firstName: firstName || '',
  lastName: lastName || '',
  role: 'Member', // Default role for Google users
  organizationId: 'org-2',
  organizationName: 'ChurchFlow GoodNews HighCost',
  organizationType: 'LC'
}
```

### 6. Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the signin page
3. Click "Sign in with Google"
4. Complete the OAuth flow
5. Verify you're redirected to the dashboard

### 7. Production Deployment

For production deployment:

1. Update `NEXTAUTH_URL` to your production domain
2. Add production redirect URI to Google OAuth app
3. Use a secure `NEXTAUTH_SECRET`
4. Consider using a production database

### 8. Troubleshooting

#### Common Issues:

**"Invalid redirect URI"**
- Check that the redirect URI in Google OAuth app matches exactly
- Ensure `NEXTAUTH_URL` is set correctly

**"Client ID not found"**
- Verify `GOOGLE_CLIENT_ID` in `.env.local`
- Check that the Google OAuth app is active

**"Session not persisting"**
- Ensure `NEXTAUTH_SECRET` is set
- Check that cookies are enabled

### 9. Security Considerations

- Never commit `.env.local` to version control
- Use strong, unique `NEXTAUTH_SECRET` in production
- Regularly rotate OAuth credentials
- Implement proper user role management
- Consider implementing additional security measures

### 10. Next Steps

- Customize user roles and permissions
- Implement user profile management
- Add additional OAuth providers if needed
- Set up proper user data persistence
- Implement audit logging for OAuth sign-ins

## Support

If you encounter any issues with the Google OAuth setup, check:
1. Google OAuth app configuration
2. Environment variables
3. Redirect URI settings
4. Network connectivity
5. Browser console for errors
