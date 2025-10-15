import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Get all data for dashboard
    const [expenditures, incomes, staff, accounts] = await Promise.all([
      db.getExpenditures(),
      db.getIncomes(),
      db.getStaff(),
      db.getAccounts()
    ])

    // Calculate dashboard metrics
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)
    const totalExpenditure = expenditures.reduce((sum, exp) => sum + exp.amount, 0)
    const pendingExpenditures = expenditures.filter(exp => exp.status === 'pending').length
    const totalStaff = staff.filter(s => s.isActive).length
    const totalAccounts = accounts.filter(acc => acc.isActive).length

    const dashboardData = {
      metrics: {
        totalIncome,
        totalExpenditure,
        netBalance: totalIncome - totalExpenditure,
        pendingExpenditures,
        totalStaff,
        totalAccounts
      },
      recentExpenditures: expenditures.slice(0, 5),
      recentIncomes: incomes.slice(0, 5),
      recentStaff: staff.slice(0, 5)
    }

    return NextResponse.json({
      success: true,
      data: dashboardData
    })

  } catch (error) {
    console.error('Get dashboard data error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
