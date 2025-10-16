import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        // Verify that the user has a verified email
        if (!user.email) {
          console.log('Google OAuth: No email provided')
          return false
        }

        // Check if email is verified by Google
        if (profile?.email_verified !== true) {
          console.log('Google OAuth: Email not verified by Google')
          return false
        }

        // Additional validation: Check if user exists in our system or create them
        try {
          // Here you could check against your database
          // For now, we'll allow all verified Google users
          console.log('Google OAuth: User verified successfully', user.email)
          return true
        } catch (error) {
          console.error('Google OAuth: Error during verification', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account, profile }) {
      if (account && user) {
        token.accessToken = account.access_token
        token.userId = user.id
        token.email = user.email
        token.name = user.name
        token.emailVerified = profile?.email_verified || false
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
