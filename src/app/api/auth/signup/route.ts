import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    const { firstName, lastName, email, phone, password, organizationType, organizationName } = userData

    if (!firstName || !lastName || !email || !phone || !password || !organizationType || !organizationName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create organization first
    const organization = await db.createOrganization({
      name: organizationName,
      type: organizationType as any,
      isActive: true
    })

    // Create user
    const user = await db.createUser({
      email,
      firstName,
      lastName,
      phone,
      role: 'LC Secretary', // Default role for new users
      organizationId: organization.id,
      password: password, // In real app, this would be hashed
      isActive: true
    })

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Return user data without password
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
      phone: user.phone,
      role: user.role,
      organizationId: user.organizationId,
      organizationName: organization.name,
      organizationType: organization.type
    }

    return NextResponse.json({
      success: true,
      token,
      user: userResponse
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}