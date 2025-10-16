import { NextResponse } from 'next/server'
import { EmailService } from '@/lib/email-service'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Store verification code (in a real app, you'd store this in a database)
    // For now, we'll just send the email
    
    // Send verification email
    const emailResult = await EmailService.sendVerificationEmail(email, verificationCode)
    
    if (!emailResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to send verification email' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Verification email sent successfully',
      // In development, include the code for testing
      ...(process.env.NODE_ENV === 'development' && { verificationCode })
    })
  } catch (error: any) {
    console.error('Email verification error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to send verification email' 
    }, { status: 500 })
  }
}
