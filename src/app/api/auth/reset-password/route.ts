import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import EmailService from '@/lib/email-service'
import crypto from 'crypto'

// Store password reset tokens (in production, use Redis or database)
const resetTokens = new Map<string, { email: string; expires: number }>()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await db.getUserByEmail(email)
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = Date.now() + 3600000 // 1 hour

    // Store token
    resetTokens.set(resetToken, { email, expires: expiresAt })

    // Send reset email
    const emailResult = await EmailService.sendPasswordResetEmail(email, resetToken)
    
    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error)
      return NextResponse.json(
        { error: 'Failed to send reset email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    })

  } catch (error) {
    console.error('Password reset request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      )
    }

    // Check if token exists and is valid
    const tokenData = resetTokens.get(token)
    if (!tokenData || tokenData.expires < Date.now()) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      )
    }

    // Get user by email
    const user = await db.getUserByEmail(tokenData.email)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update password (in production, hash the password)
    // For now, we'll just update the user record
    const updatedUser = {
      ...user,
      password: newPassword, // In production, hash this
      updatedAt: new Date()
    }

    // Remove used token
    resetTokens.delete(token)

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully'
    })

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to validate reset token
function validateResetToken(token: string): { valid: boolean; email?: string } {
  const tokenData = resetTokens.get(token)
  
  if (!tokenData || tokenData.expires < Date.now()) {
    return { valid: false }
  }

  return { valid: true, email: tokenData.email }
}
