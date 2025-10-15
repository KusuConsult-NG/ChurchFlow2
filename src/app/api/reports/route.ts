import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'financial'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const organizationId = searchParams.get('organizationId')

    let reportData: any = {}

    switch (type) {
      case 'financial':
        reportData = await generateFinancialReport(startDate, endDate, organizationId)
        break
      case 'audit':
        reportData = await generateAuditReport(startDate, endDate, organizationId)
        break
      case 'hr':
        reportData = await generateHRReport(startDate, endDate, organizationId)
        break
      case 'expenditure':
        reportData = await generateExpenditureReport(startDate, endDate, organizationId)
        break
      case 'income':
        reportData = await generateIncomeReport(startDate, endDate, organizationId)
        break
      default:
        reportData = await generateFinancialReport(startDate, endDate, organizationId)
    }

    return NextResponse.json({
      success: true,
      data: reportData
    })

  } catch (error) {
    console.error('Get reports error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function generateFinancialReport(startDate?: string | null, endDate?: string | null, organizationId?: string | null) {
  const [expenditures, incomes, accounts] = await Promise.all([
    db.getExpenditures(),
    db.getIncomes(),
    db.getAccounts()
  ])

  // Filter by date range if provided
  let filteredExpenditures = expenditures
  let filteredIncomes = incomes

  if (startDate && endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    filteredExpenditures = expenditures.filter(exp => {
      const expDate = new Date(exp.createdAt)
      return expDate >= start && expDate <= end
    })
    
    filteredIncomes = incomes.filter(inc => {
      const incDate = new Date(inc.date)
      return incDate >= start && incDate <= end
    })
  }

  // Filter by organization if provided
  if (organizationId) {
    filteredExpenditures = filteredExpenditures.filter(exp => exp.organizationId === organizationId)
    filteredIncomes = filteredIncomes.filter(inc => inc.organizationId === organizationId)
  }

  const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0)
  const totalExpenditure = filteredExpenditures.reduce((sum, exp) => sum + exp.amount, 0)
  const netBalance = totalIncome - totalExpenditure

  // Income breakdown by type
  const incomeByType = filteredIncomes.reduce((acc, income) => {
    acc[income.type] = (acc[income.type] || 0) + income.amount
    return acc
  }, {} as Record<string, number>)

  // Expenditure breakdown by type
  const expenditureByType = filteredExpenditures.reduce((acc, exp) => {
    acc[exp.type] = (acc[exp.type] || 0) + exp.amount
    return acc
  }, {} as Record<string, number>)

  // Monthly trends
  const monthlyData = generateMonthlyTrends(filteredIncomes, filteredExpenditures)

  return {
    summary: {
      totalIncome,
      totalExpenditure,
      netBalance,
      period: startDate && endDate ? `${startDate} to ${endDate}` : 'All time'
    },
    incomeByType,
    expenditureByType,
    monthlyTrends: monthlyData,
    topExpenditures: filteredExpenditures
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10),
    topIncomes: filteredIncomes
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10)
  }
}

async function generateAuditReport(startDate?: string | null, endDate?: string | null, organizationId?: string | null) {
  const [auditLogs, expenditures, incomes] = await Promise.all([
    db.getAuditLogs(),
    db.getExpenditures(),
    db.getIncomes()
  ])

  // Filter by date range if provided
  let filteredLogs = auditLogs
  if (startDate && endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    filteredLogs = auditLogs.filter(log => {
      const logDate = new Date(log.timestamp)
      return logDate >= start && logDate <= end
    })
  }

  // Filter by organization if provided
  if (organizationId) {
    filteredLogs = filteredLogs.filter(log => 
      expenditures.some(exp => exp.id === log.resourceId && exp.organizationId === organizationId) ||
      incomes.some(inc => inc.id === log.resourceId && inc.organizationId === organizationId)
    )
  }

  // Group by action type
  const actionsByType = filteredLogs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Group by user
  const actionsByUser = filteredLogs.reduce((acc, log) => {
    acc[log.userId] = (acc[log.userId] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    summary: {
      totalActions: filteredLogs.length,
      period: startDate && endDate ? `${startDate} to ${endDate}` : 'All time'
    },
    actionsByType,
    actionsByUser,
    recentActions: filteredLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50)
  }
}

async function generateHRReport(startDate?: string | null, endDate?: string | null, organizationId?: string | null) {
  const staff = await db.getStaff()

  // Filter by organization if provided
  let filteredStaff = staff
  if (organizationId) {
    filteredStaff = staff.filter(s => s.organizationId === organizationId)
  }

  const totalStaff = filteredStaff.length
  const activeStaff = filteredStaff.filter(s => s.isActive).length
  const totalSalary = filteredStaff.reduce((sum, s) => sum + s.salary, 0)
  const totalAllowances = filteredStaff.reduce((sum, s) => 
    sum + s.allowances.reduce((allowanceSum, allowance) => allowanceSum + allowance.amount, 0), 0
  )

  // Group by role
  const staffByRole = filteredStaff.reduce((acc, s) => {
    acc[s.role] = (acc[s.role] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Group by employment type
  const staffByType = filteredStaff.reduce((acc, s) => {
    acc[s.employmentType] = (acc[s.employmentType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    summary: {
      totalStaff,
      activeStaff,
      totalSalary,
      totalAllowances,
      totalPayroll: totalSalary + totalAllowances
    },
    staffByRole,
    staffByType,
    staffList: filteredStaff
  }
}

async function generateExpenditureReport(startDate?: string | null, endDate?: string | null, organizationId?: string | null) {
  const expenditures = await db.getExpenditures()

  // Filter by date range if provided
  let filteredExpenditures = expenditures
  if (startDate && endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    filteredExpenditures = expenditures.filter(exp => {
      const expDate = new Date(exp.createdAt)
      return expDate >= start && expDate <= end
    })
  }

  // Filter by organization if provided
  if (organizationId) {
    filteredExpenditures = filteredExpenditures.filter(exp => exp.organizationId === organizationId)
  }

  const totalAmount = filteredExpenditures.reduce((sum, exp) => sum + exp.amount, 0)

  // Group by status
  const byStatus = filteredExpenditures.reduce((acc, exp) => {
    acc[exp.status] = (acc[exp.status] || 0) + exp.amount
    return acc
  }, {} as Record<string, number>)

  // Group by type
  const byType = filteredExpenditures.reduce((acc, exp) => {
    acc[exp.type] = (acc[exp.type] || 0) + exp.amount
    return acc
  }, {} as Record<string, number>)

  return {
    summary: {
      totalAmount,
      totalCount: filteredExpenditures.length,
      period: startDate && endDate ? `${startDate} to ${endDate}` : 'All time'
    },
    byStatus,
    byType,
    expenditures: filteredExpenditures
  }
}

async function generateIncomeReport(startDate?: string | null, endDate?: string | null, organizationId?: string | null) {
  const incomes = await db.getIncomes()

  // Filter by date range if provided
  let filteredIncomes = incomes
  if (startDate && endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    filteredIncomes = incomes.filter(inc => {
      const incDate = new Date(inc.date)
      return incDate >= start && incDate <= end
    })
  }

  // Filter by organization if provided
  if (organizationId) {
    filteredIncomes = filteredIncomes.filter(inc => inc.organizationId === organizationId)
  }

  const totalAmount = filteredIncomes.reduce((sum, inc) => sum + inc.amount, 0)

  // Group by type
  const byType = filteredIncomes.reduce((acc, inc) => {
    acc[inc.type] = (acc[inc.type] || 0) + inc.amount
    return acc
  }, {} as Record<string, number>)

  // Group by status
  const byStatus = filteredIncomes.reduce((acc, inc) => {
    acc[inc.status] = (acc[inc.status] || 0) + inc.amount
    return acc
  }, {} as Record<string, number>)

  return {
    summary: {
      totalAmount,
      totalCount: filteredIncomes.length,
      period: startDate && endDate ? `${startDate} to ${endDate}` : 'All time'
    },
    byType,
    byStatus,
    incomes: filteredIncomes
  }
}

function generateMonthlyTrends(incomes: any[], expenditures: any[]) {
  const monthlyData: Record<string, { income: number, expenditure: number }> = {}

  // Process incomes
  incomes.forEach(income => {
    const month = new Date(income.date).toISOString().slice(0, 7) // YYYY-MM
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expenditure: 0 }
    }
    monthlyData[month].income += income.amount
  })

  // Process expenditures
  expenditures.forEach(exp => {
    const month = new Date(exp.createdAt).toISOString().slice(0, 7) // YYYY-MM
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expenditure: 0 }
    }
    monthlyData[month].expenditure += exp.amount
  })

  // Convert to array format
  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      income: data.income,
      expenditure: data.expenditure,
      net: data.income - data.expenditure
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
}
