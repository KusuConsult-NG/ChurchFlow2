import { NextRequest, NextResponse } from 'next/server'
import TwilioService from '@/lib/twilio-service'

// Store verification codes (in production, use Redis or database)
const verificationCodes = new Map<string, { code: string; expires: number; attempts: number }>()

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, action } = await request.json()

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Validate phone number format
    const formattedPhone = TwilioService.formatPhoneNumber(phoneNumber)
    if (!TwilioService.validatePhoneNumber(formattedPhone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    // Generate verification code
    const code = TwilioService.generateVerificationCode()
    const expiresAt = Date.now() + (action === 'password_reset' ? 900000 : 600000) // 15 min for password reset, 10 min for 2FA

    // Store verification code
    verificationCodes.set(formattedPhone, {
      code,
      expires: expiresAt,
      attempts: 0
    })

    // Send SMS based on action
    let smsResult
    switch (action) {
      case 'password_reset':
        smsResult = await TwilioService.sendPasswordResetSMS(formattedPhone, code)
        break
      case 'two_factor':
        smsResult = await TwilioService.send2FACode(formattedPhone, code)
        break
      default:
        smsResult = await TwilioService.send2FACode(formattedPhone, code)
    }

    if (!smsResult.success) {
      // Remove stored code if SMS failed
      verificationCodes.delete(formattedPhone)
      return NextResponse.json(
        { error: smsResult.error || 'Failed to send verification code' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully',
      messageId: smsResult.messageId
    })

  } catch (error) {
    console.error('Send verification code error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { phoneNumber, code, action } = await request.json()

    if (!phoneNumber || !code) {
      return NextResponse.json(
        { error: 'Phone number and code are required' },
        { status: 400 }
      )
    }

    const formattedPhone = TwilioService.formatPhoneNumber(phoneNumber)
    const storedData = verificationCodes.get(formattedPhone)

    if (!storedData) {
      return NextResponse.json(
        { error: 'No verification code found for this phone number' },
        { status: 404 }
      )
    }

    // Check if code has expired
    if (Date.now() > storedData.expires) {
      verificationCodes.delete(formattedPhone)
      return NextResponse.json(
        { error: 'Verification code has expired' },
        { status: 400 }
      )
    }

    // Check attempt limit
    if (storedData.attempts >= 3) {
      verificationCodes.delete(formattedPhone)
      return NextResponse.json(
        { error: 'Too many failed attempts. Please request a new code.' },
        { status: 400 }
      )
    }

    // Verify code
    if (storedData.code !== code) {
      storedData.attempts++
      verificationCodes.set(formattedPhone, storedData)
      
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Code is valid, remove it
    verificationCodes.delete(formattedPhone)

    return NextResponse.json({
      success: true,
      message: 'Verification code verified successfully'
    })

  } catch (error) {
    console.error('Verify code error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to validate verification code
function validateVerificationCode(phoneNumber: string, code: string): { valid: boolean; error?: string } {
  const formattedPhone = TwilioService.formatPhoneNumber(phoneNumber)
  const storedData = verificationCodes.get(formattedPhone)

  if (!storedData) {
    return { valid: false, error: 'No verification code found' }
  }

  if (Date.now() > storedData.expires) {
    verificationCodes.delete(formattedPhone)
    return { valid: false, error: 'Verification code has expired' }
  }

  if (storedData.attempts >= 3) {
    verificationCodes.delete(formattedPhone)
    return { valid: false, error: 'Too many failed attempts' }
  }

  if (storedData.code !== code) {
    storedData.attempts++
    verificationCodes.set(formattedPhone, storedData)
    return { valid: false, error: 'Invalid verification code' }
  }

  return { valid: true }
}
