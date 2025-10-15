import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const organizations = await db.getOrganizations()
    
    return NextResponse.json({
      success: true,
      data: organizations
    })

  } catch (error) {
    console.error('Get organizations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const organizationData = await request.json()

    const { name, type, parentId, address, phone, email, secretaryName, secretaryEmail, secretaryPhone } = organizationData

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      )
    }

    const organization = await db.createOrganization({
      name,
      type: type as any,
      parentId,
      address,
      phone,
      email,
      secretaryName,
      secretaryEmail,
      secretaryPhone,
      isActive: true
    })

    return NextResponse.json({
      success: true,
      data: organization
    })

  } catch (error) {
    console.error('Create organization error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
