'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signOut, useSession } from 'next-auth/react'

interface User {
  id: string
  email: string
  name: string
  firstName: string
  lastName: string
  role: string
  organizationId?: string
  organizationName?: string
  organizationType?: 'GCC' | 'DCC' | 'LCC' | 'LC'
  emailVerified?: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signup: (userData: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Only run on client side
        if (typeof window === 'undefined') {
          setLoading(false)
          return
        }

        // Check NextAuth session first
        if (session?.user) {
          // Convert NextAuth session to our User format
          setUser({
            id: (session as any).userId || session.user.email || 'unknown',
            email: session.user.email || '',
            name: session.user.name || '',
            firstName: session.user.name?.split(' ')[0] || '',
            lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
            role: 'Member', // Default role, could be stored in session
            emailVerified: (session as any).emailVerified || false
          })
          setLoading(false)
          return
        }

        // Fallback to token-based auth for regular users
        const token = localStorage.getItem('auth_token')
        if (token) {
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
          } else {
            localStorage.removeItem('auth_token')
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token')
        }
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [session, status])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', data.token)
        }
        setUser(data.user)
        router.push('/dashboard')
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Login failed')
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      // Force account selection by clearing any existing session first
      await signOut({ redirect: false })
      
      // Use NextAuth's signIn function with Google provider
      const result = await signIn('google', { 
        redirect: false,
        callbackUrl: '/dashboard',
        prompt: 'select_account' // Force account selection
      })
      
      if (result?.error) {
        throw new Error(result.error)
      }
      
      // The session will be updated automatically by NextAuth
      // We'll handle the redirect in the useEffect below
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (response.ok) {
        const data = await response.json()
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', data.token)
        }
        setUser(data.user)
        router.push('/dashboard')
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Sign up failed')
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signInWithGoogle,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}