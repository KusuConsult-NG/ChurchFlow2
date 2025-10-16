'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Mail, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function EmailVerificationError() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md churchflow-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Email Verification Required
          </CardTitle>
          <CardDescription className="text-gray-600">
            Your email address needs to be verified before you can sign in.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Email Not Verified
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Please check your email and click the verification link sent by Google, 
                  or try signing in with a different Google account that has a verified email.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/auth/signin')}
              className="w-full churchflow-primary"
            >
              Try Again
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
              className="w-full churchflow-secondary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Need help? Contact support for assistance with email verification.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
