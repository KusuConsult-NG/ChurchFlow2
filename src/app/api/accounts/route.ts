import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const accounts = await db.getAccounts()
    
    return NextResponse.json({
      success: true,
      data: accounts
    })

  } catch (error) {
    console.error('Get accounts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const accountData = await request.json()

    const { 
      name, 
      type, 
      organizationId, 
      bankName, 
      accountNumber, 
      balance 
    } = accountData

    if (!name || !type || !organizationId || !bankName || !accountNumber) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    const account = await db.createAccount({
      name,
      type: type as any,
      organizationId,
      bankName,
      accountNumber,
      balance: parseFloat(balance) || 0,
      isActive: true
    })

    return NextResponse.json({
      success: true,
      data: account
    })

  } catch (error) {
    console.error('Create account error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
