import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const expenditures = await db.getExpenditures()
    
    return NextResponse.json({
      success: true,
      data: expenditures
    })

  } catch (error) {
    console.error('Get expenditures error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const expenditureData = await request.json()

    const { 
      title, 
      description, 
      amount, 
      type, 
      requestedBy, 
      organizationId, 
      agencyId, 
      bankName, 
      accountNumber, 
      beneficiaryName 
    } = expenditureData

    if (!title || !description || !amount || !type || !requestedBy || !organizationId) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    const expenditure = await db.createExpenditure({
      title,
      description,
      amount: parseFloat(amount),
      type: type as any,
      status: 'draft',
      requestedBy,
      organizationId,
      agencyId,
      bankName,
      accountNumber,
      beneficiaryName,
      approvalFlow: []
    })

    return NextResponse.json({
      success: true,
      data: expenditure
    })

  } catch (error) {
    console.error('Create expenditure error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
