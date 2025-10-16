import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { NextAuthOptions } from 'next-auth'

// Extend the Profile type to include Google-specific properties
interface GoogleProfile {
  email_verified?: boolean
  email?: string
  name?: string
  picture?: string
  sub?: string
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        // Google OAuth users are already verified by Google
        // We just need to ensure they have an email
        if (!user.email) {
          console.log('Google OAuth: No email provided')
          return false
        }

        // Google OAuth users are considered verified
        console.log('Google OAuth: User authenticated successfully', user.email)
        return true
      }
      
      // For regular email/password signin, we'll handle verification separately
      return true
    },
    async jwt({ token, user, account, profile }) {
      if (account && user) {
        token.accessToken = account.access_token
        token.userId = user.id
        token.email = user.email
        token.name = user.name
        
        // For Google OAuth users, they are considered verified
        if (account.provider === 'google') {
          token.emailVerified = true
        } else {
          // For regular users, check if email is verified
          const googleProfile = profile as GoogleProfile
          token.emailVerified = googleProfile?.email_verified || false
        }
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      (session as any).accessToken = token.accessToken as string
      (session as any).userId = token.userId as string
      (session as any).emailVerified = token.emailVerified as boolean
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/email-verification-error',
  },
  session: {
    strategy: 'jwt',
  },
}

export default NextAuth(authOptions)
