import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const updateData = await request.json()

    const expenditure = await db.updateExpenditure(id, updateData)

    if (!expenditure) {
      return NextResponse.json(
        { error: 'Expenditure not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: expenditure
    })

  } catch (error) {
    console.error('Update expenditure error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const expenditure = await db.getExpenditureById(id)

    if (!expenditure) {
      return NextResponse.json(
        { error: 'Expenditure not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: expenditure
    })

  } catch (error) {
    console.error('Get expenditure error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
