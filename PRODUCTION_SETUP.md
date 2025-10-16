# Production Environment Setup

## Required Environment Variables for Vercel

Set these environment variables in your Vercel dashboard:

### Authentication
```
NEXTAUTH_URL=https://church-flow2.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-key
```

### Google OAuth
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### API Configuration
```
NEXT_PUBLIC_API_URL=https://church-flow2.vercel.app
```

## Google Cloud Console Setup

### Required Redirect URIs
Add these redirect URIs to your Google OAuth application:

1. **Production**: `https://church-flow2.vercel.app/api/auth/callback/google`
2. **Development**: `http://localhost:3000/api/auth/callback/google`

### Steps to Configure:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" > "Credentials"
4. Click on your OAuth 2.0 Client ID
5. Add the redirect URIs listed above
6. Save the changes

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project (church-flow2)
3. Go to "Settings" > "Environment Variables"
4. Add each variable with the corresponding value
5. Make sure to set them for "Production" environment
6. Redeploy your application

## Security Notes

- Never commit `.env` files to version control
- Use Vercel's environment variables for production secrets
- Keep your Google OAuth credentials secure
- Regularly rotate API keys and secrets
