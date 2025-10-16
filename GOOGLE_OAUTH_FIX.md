# Google OAuth Redirect URI Fix

## 🚨 **Current Error**
```
Error 400: redirect_uri_mismatch
redirect_uri: https://church-flow2.vercel.app/api/auth/callback/google
```

## 🔧 **Solution: Add Redirect URIs to Google Cloud Console**

### **Step 1: Access Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **"APIs & Services"** → **"Credentials"**

### **Step 2: Update OAuth 2.0 Client ID**
1. Find your OAuth 2.0 Client ID: `580742150709-mpn30oboekd15954ajfiqdi7fuf6ueta.apps.googleusercontent.com`
2. Click on it to edit
3. In the **"Authorized redirect URIs"** section, add these URIs:

#### **Production URIs:**
```
https://church-flow2.vercel.app/api/auth/callback/google
```

#### **Development URIs:**
```
http://localhost:3000/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
```

### **Step 3: Save Configuration**
- Click **"Save"** to apply changes
- Wait 5-10 minutes for changes to propagate

## 🔄 **Environment Variables**

### **For Local Development:**
```env
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### **For Production (Vercel):**
```env
NEXTAUTH_URL=https://church-flow2.vercel.app
NEXT_PUBLIC_API_URL=https://church-flow2.vercel.app
```

## 🧪 **Testing Steps**

### **1. Test Locally:**
```bash
npm run dev
# Visit: http://localhost:3000/auth/signin
# Click "Continue with Google"
```

### **2. Test Production:**
- Deploy to Vercel
- Visit: https://church-flow2.vercel.app/auth/signin
- Click "Continue with Google"

## 📋 **Required Redirect URIs Summary**

Add these exact URIs to your Google Cloud Console:

1. `https://church-flow2.vercel.app/api/auth/callback/google` (Production)
2. `http://localhost:3000/api/auth/callback/google` (Local Development)
3. `http://localhost:3001/api/auth/callback/google` (Alternative Local Port)

## 🔗 **Reference Links**

- [Google OAuth 2.0 Redirect URI Documentation](https://developers.google.com/identity/protocols/oauth2/web-server#authorization-errors-redirect-uri-mismatch)
- [NextAuth.js Google Provider Documentation](https://next-auth.js.org/providers/google)

## ⚠️ **Important Notes**

- Changes in Google Cloud Console can take 5-10 minutes to propagate
- Make sure the URIs match exactly (including protocol, domain, and path)
- The callback path `/api/auth/callback/google` is NextAuth.js standard
- Test both local and production environments
