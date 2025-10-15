import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const incomes = await db.getIncomes()
    
    return NextResponse.json({
      success: true,
      data: incomes
    })

  } catch (error) {
    console.error('Get incomes error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const incomeData = await request.json()

    const { 
      type, 
      amount, 
      description, 
      source, 
      date, 
      recordedBy, 
      organizationId, 
      reference 
    } = incomeData

    if (!type || !amount || !description || !source || !recordedBy || !organizationId) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    const income = await db.createIncome({
      type: type as any,
      amount: parseFloat(amount),
      description,
      source,
      date: new Date(date),
      recordedBy,
      organizationId,
      reference: reference || `INC-${Date.now()}`,
      status: 'pending'
    })

    return NextResponse.json({
      success: true,
      data: income
    })

  } catch (error) {
    console.error('Create income error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
