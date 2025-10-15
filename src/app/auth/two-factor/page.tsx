'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Shield, Smartphone } from 'lucide-react'
import Link from 'next/link'

export default function TwoFactorAuthPage() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [step, setStep] = useState<'phone' | 'verify'>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/verify-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phoneNumber, 
          action: 'two_factor' 
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStep('verify')
        setCountdown(60) // 60 seconds countdown
        startCountdown()
      } else {
        setError(data.error || 'Failed to send verification code')
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/verify-sms', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phoneNumber, 
          code: verificationCode,
          action: 'two_factor'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setError(data.error || 'Invalid verification code')
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const resendCode = async () => {
    if (countdown > 0) return
    
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/verify-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phoneNumber, 
          action: 'two_factor' 
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setCountdown(60)
        startCountdown()
      } else {
        setError(data.error || 'Failed to resend verification code')
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-500">ChurchFlow</h1>
          <p className="mt-2 text-sm text-gray-600">
            Financial Management System
          </p>
        </div>

        <Card className="churchflow-card">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {step === 'phone' ? 'Two-Factor Authentication' : 'Verify Your Phone'}
            </CardTitle>
            <CardDescription>
              {step === 'phone' 
                ? 'Enter your phone number to receive a verification code'
                : 'Enter the 6-digit code sent to your phone'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center">
                <div className="mb-4">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Verification Successful
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your phone number has been verified. Redirecting to dashboard...
                </p>
              </div>
            ) : (
              <form onSubmit={step === 'phone' ? handleSendCode : handleVerifyCode} className="space-y-6">
                {step === 'phone' ? (
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        autoComplete="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+234 801 234 5678"
                        className="pl-10"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Include country code (e.g., +234 for Nigeria)
                    </p>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Verification Code
                    </label>
                    <Input
                      id="verificationCode"
                      name="verificationCode"
                      type="text"
                      autoComplete="one-time-code"
                      required
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="123456"
                      className="text-center text-lg tracking-widest"
                      maxLength={6}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter the 6-digit code sent to {phoneNumber}
                    </p>
                  </div>
                )}

                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}

                <div>
                  <Button
                    type="submit"
                    className="w-full churchflow-primary"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : (step === 'phone' ? 'Send Code' : 'Verify Code')}
                  </Button>
                </div>

                {step === 'verify' && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Didn't receive the code?
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resendCode}
                      disabled={countdown > 0 || loading}
                      className="churchflow-secondary"
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                    </Button>
                  </div>
                )}
              </form>
            )}

            <div className="mt-6 text-center text-sm">
              <Link href="/auth/signin" className="font-medium text-primary-500 hover:text-primary-600">
                <ArrowLeft className="h-4 w-4 inline mr-1" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
