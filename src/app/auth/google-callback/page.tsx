'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function GoogleCallbackPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (session) {
      // Successfully authenticated
      window.opener?.postMessage({
        type: 'GOOGLE_AUTH_SUCCESS',
        user: session.user
      }, window.location.origin)
      
      // Close the popup
      window.close()
    } else {
      // Authentication failed
      window.opener?.postMessage({
        type: 'GOOGLE_AUTH_ERROR',
        error: 'Authentication failed'
      }, window.location.origin)
      
      // Close the popup
      window.close()
    }
  }, [session, status])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">
          {status === 'loading' ? 'Authenticating...' : 'Completing sign in...'}
        </p>
      </div>
    </div>
  )
}
