import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const organizationId = searchParams.get('organizationId')

    const expenditures = await db.getExpenditures()

    // Filter by organization if provided
    let filteredExpenditures = expenditures
    if (organizationId) {
      filteredExpenditures = expenditures.filter(exp => exp.organizationId === organizationId)
    }

    // Filter by status
    if (status !== 'all') {
      filteredExpenditures = filteredExpenditures.filter(exp => exp.status === status)
    }

    // Get pending approvals (expenditures that need approval)
    const pendingApprovals = filteredExpenditures.filter(exp => 
      exp.status === 'pending' || exp.status === 'draft'
    )

    // Get approval history
    const approvalHistory = filteredExpenditures.filter(exp => 
      exp.status === 'approved' || exp.status === 'rejected'
    )

    return NextResponse.json({
      success: true,
      data: {
        pendingApprovals,
        approvalHistory,
        summary: {
          totalPending: pendingApprovals.length,
          totalApproved: approvalHistory.filter(exp => exp.status === 'approved').length,
          totalRejected: approvalHistory.filter(exp => exp.status === 'rejected').length,
          totalAmount: filteredExpenditures.reduce((sum, exp) => sum + exp.amount, 0)
        }
      }
    })

  } catch (error) {
    console.error('Get approvals error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { expenditureId, action, comments, userId } = body

    if (!expenditureId || !action || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const expenditure = await db.getExpenditureById(expenditureId)
    if (!expenditure) {
      return NextResponse.json(
        { error: 'Expenditure not found' },
        { status: 404 }
      )
    }

    // Update expenditure status based on action
    let newStatus = expenditure.status
    if (action === 'approve') {
      newStatus = 'approved'
    } else if (action === 'reject') {
      newStatus = 'rejected'
    }

    // Add approval step to the approval flow
    const newApprovalStep = {
      id: `step-${Date.now()}`,
      expenditureId,
      step: expenditure.approvalFlow.length + 1,
      role: 'Approver', // This would come from user role in real app
      userId,
      status: (action === 'approve' ? 'approved' : 'rejected') as 'approved' | 'rejected',
      comments,
      timestamp: new Date()
    }

    const updatedExpenditure = await db.updateExpenditure(expenditureId, {
      status: newStatus,
      approvalFlow: [...expenditure.approvalFlow, newApprovalStep]
    })

    if (!updatedExpenditure) {
      return NextResponse.json(
        { error: 'Failed to update expenditure' },
        { status: 500 }
      )
    }

    // Create audit log
    await db.createAuditLog({
      userId,
      action: `expenditure_${action}`,
      resource: 'expenditure',
      resourceId: expenditureId,
      details: {
        previousStatus: expenditure.status,
        newStatus,
        comments,
        amount: expenditure.amount
      },
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      timestamp: new Date()
    })

    return NextResponse.json({
      success: true,
      data: updatedExpenditure
    })

  } catch (error) {
    console.error('Approve/reject expenditure error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
