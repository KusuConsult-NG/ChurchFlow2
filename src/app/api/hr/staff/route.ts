import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const staff = await db.getStaff()
    
    return NextResponse.json({
      success: true,
      data: staff
    })

  } catch (error) {
    console.error('Get staff error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const staffData = await request.json()

    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      role, 
      department, 
      employmentType, 
      startDate, 
      salary, 
      allowances, 
      organizationId 
    } = staffData

    if (!firstName || !lastName || !email || !phone || !role || !organizationId) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    const staff = await db.createStaff({
      firstName,
      lastName,
      email,
      phone,
      role,
      department: department || 'General',
      employmentType: employmentType as any || 'permanent',
      startDate: new Date(startDate),
      salary: parseFloat(salary) || 0,
      allowances: allowances || [],
      organizationId,
      isActive: true
    })

    return NextResponse.json({
      success: true,
      data: staff
    })

  } catch (error) {
    console.error('Create staff error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
