'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download,
  Calendar,
  Filter,
  FileText,
  DollarSign,
  Users,
  Building2,
  Activity
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { apiClient } from '@/lib/api-client'

interface ReportData {
  summary: {
    totalIncome: number
    totalExpenditure: number
    netBalance: number
    period: string
  }
  incomeByType: Record<string, number>
  expenditureByType: Record<string, number>
  monthlyTrends: Array<{
    month: string
    income: number
    expenditure: number
    net: number
  }>
  topExpenditures: any[]
  topIncomes: any[]
}

export default function ReportsPage() {
  const { user } = useAuth()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [reportType, setReportType] = useState<'financial' | 'audit' | 'hr' | 'expenditure' | 'income'>('financial')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [organizationId, setOrganizationId] = useState('')
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getReports(reportType, {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          organizationId: organizationId || user?.organizationId
        })
        setReportData(response.data)
      } catch (error) {
        console.error('Failed to fetch report data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchReportData()
    }
  }, [user, reportType, startDate, endDate, organizationId])

  const handleGenerateReport = async () => {
    setGenerating(true)
    try {
      const response = await apiClient.getReports(reportType, {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        organizationId: organizationId || user?.organizationId
      })
      setReportData(response.data)
    } catch (error) {
      console.error('Failed to generate report:', error)
      alert('Failed to generate report. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleExportReport = () => {
    if (!reportData) return
    
    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading reports...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-500">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and view comprehensive reports</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            className="churchflow-secondary"
            onClick={handleExportReport}
            disabled={!reportData}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button 
            className="churchflow-primary"
            onClick={handleGenerateReport}
            disabled={generating}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {generating ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </div>

      {/* Report Controls */}
      <Card className="churchflow-card">
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>Configure your report parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="financial">Financial Report</option>
                <option value="audit">Audit Report</option>
                <option value="hr">HR Report</option>
                <option value="expenditure">Expenditure Report</option>
                <option value="income">Income Report</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization
              </label>
              <select
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Organizations</option>
                <option value="org1">ChurchFlow GoodNews HighCost</option>
                <option value="org2">ChurchFlow Headquarters</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Results */}
      {reportData && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="churchflow-card">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Income</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {apiClient.formatCurrency(reportData.summary.totalIncome)}
                    </p>
                    <p className="text-xs text-gray-500">{reportData.summary.period}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="churchflow-card">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Expenditure</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {apiClient.formatCurrency(reportData.summary.totalExpenditure)}
                    </p>
                    <p className="text-xs text-gray-500">{reportData.summary.period}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="churchflow-card">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Net Balance</p>
                    <p className={`text-2xl font-bold ${
                      reportData.summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {apiClient.formatCurrency(reportData.summary.netBalance)}
                    </p>
                    <p className="text-xs text-gray-500">{reportData.summary.period}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Income Breakdown */}
          <Card className="churchflow-card">
            <CardHeader>
              <CardTitle>Income Breakdown by Type</CardTitle>
              <CardDescription>Income distribution across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(reportData.incomeByType).map(([type, amount]) => (
                  <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium capitalize">{type}</span>
                    </div>
                    <span className="font-bold text-green-600">
                      {apiClient.formatCurrency(amount)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expenditure Breakdown */}
          <Card className="churchflow-card">
            <CardHeader>
              <CardTitle>Expenditure Breakdown by Type</CardTitle>
              <CardDescription>Expenditure distribution across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(reportData.expenditureByType).map(([type, amount]) => (
                  <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="font-medium capitalize">{type}</span>
                    </div>
                    <span className="font-bold text-red-600">
                      {apiClient.formatCurrency(amount)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card className="churchflow-card">
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Income and expenditure trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.monthlyTrends.map((trend) => (
                  <div key={trend.month} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold">{trend.month}</h4>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="text-sm">
                          <span className="text-green-600 font-medium">Income: </span>
                          <span>{apiClient.formatCurrency(trend.income)}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-red-600 font-medium">Expenditure: </span>
                          <span>{apiClient.formatCurrency(trend.expenditure)}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-blue-600 font-medium">Net: </span>
                          <span className={trend.net >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {apiClient.formatCurrency(trend.net)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Expenditures */}
          <Card className="churchflow-card">
            <CardHeader>
              <CardTitle>Top Expenditures</CardTitle>
              <CardDescription>Highest expenditure items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.topExpenditures.map((expenditure) => (
                  <div key={expenditure.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">{expenditure.title}</h4>
                      <p className="text-sm text-gray-600">{expenditure.description}</p>
                      <p className="text-xs text-gray-500">{expenditure.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">
                        {apiClient.formatCurrency(expenditure.amount)}
                      </p>
                      <p className="text-xs text-gray-500">{expenditure.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Incomes */}
          <Card className="churchflow-card">
            <CardHeader>
              <CardTitle>Top Income Records</CardTitle>
              <CardDescription>Highest income items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.topIncomes.map((income) => (
                  <div key={income.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">{income.description}</h4>
                      <p className="text-sm text-gray-600">{income.source}</p>
                      <p className="text-xs text-gray-500">{income.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {apiClient.formatCurrency(income.amount)}
                      </p>
                      <p className="text-xs text-gray-500">{income.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!reportData && !loading && (
        <Card className="churchflow-card">
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Report Data</h3>
            <p className="text-gray-600 mb-4">Generate a report to view data and analytics</p>
            <Button 
              className="churchflow-primary"
              onClick={handleGenerateReport}
              disabled={generating}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {generating ? 'Generating...' : 'Generate Report'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}