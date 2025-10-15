'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Banknote, Users, Briefcase, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react'

interface DashboardData {
  metrics: {
    totalIncome: number
    totalExpenditure: number
    netBalance: number
    pendingExpenditures: number
    totalStaff: number
    totalAccounts: number
  }
  recentExpenditures: any[]
  recentIncomes: any[]
  recentStaff: any[]
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError(null)
        const response = await fetch('/api/dashboard')
        if (response.ok) {
          const data = await response.json()
          setDashboardData(data.data)
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to fetch dashboard data')
          // Set fallback data
          setDashboardData({
            metrics: {
              totalIncome: 0,
              totalExpenditure: 0,
              netBalance: 0,
              pendingExpenditures: 0,
              totalStaff: 0,
              totalAccounts: 0
            },
            recentExpenditures: [],
            recentIncomes: [],
            recentStaff: []
          })
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        setError('Network error - using offline data')
        // Set fallback data
        setDashboardData({
          metrics: {
            totalIncome: 0,
            totalExpenditure: 0,
            netBalance: 0,
            pendingExpenditures: 0,
            totalStaff: 0,
            totalAccounts: 0
          },
          recentExpenditures: [],
          recentIncomes: [],
          recentStaff: []
        })
      } finally {
        setDataLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    } else if (!loading) {
      // If no user and not loading, set loading to false
      setDataLoading(false)
    }
  }, [user, loading])

  if (loading || dataLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please sign in to view the dashboard.</p>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {user && (
        <>
          <div className="mb-6 text-lg text-gray-700">
            Welcome back, <span className="font-semibold">{user.firstName} {user.lastName}</span>!
            <p className="text-sm text-gray-500">Role: {user.role} | Organization: {user.organizationName}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Notice</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {dashboardData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardData.metrics.totalIncome)}</div>
                <p className="text-xs text-gray-500">All time income</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenditure</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardData.metrics.totalExpenditure)}</div>
                <p className="text-xs text-gray-500">All time expenses</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
                <Banknote className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${dashboardData.metrics.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(dashboardData.metrics.netBalance)}
                </div>
                <p className="text-xs text-gray-500">Current balance</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <CheckCircle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.metrics.pendingExpenditures}</div>
                <p className="text-xs text-gray-500">Requires your action</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Expenditures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.recentExpenditures.map((exp) => (
                    <div key={exp.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{exp.title}</p>
                        <p className="text-sm text-gray-500">{exp.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(exp.amount)}</p>
                        <p className="text-sm text-gray-500">{exp.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.recentIncomes.map((income) => (
                    <div key={income.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{income.type}</p>
                        <p className="text-sm text-gray-500">{income.source}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(income.amount)}</p>
                        <p className="text-sm text-gray-500">{income.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{dashboardData.metrics.totalStaff}</p>
                      <p className="text-sm text-gray-500">Total Staff</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Briefcase className="h-8 w-8 text-green-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{dashboardData.metrics.totalAccounts}</p>
                      <p className="text-sm text-gray-500">Active Accounts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-orange-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{dashboardData.metrics.pendingExpenditures}</p>
                      <p className="text-sm text-gray-500">Pending Approvals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {!dashboardData && !dataLoading && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Data Available</h2>
          <p className="text-gray-600 mb-6">Unable to load dashboard data. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
          >
            Refresh Page
          </button>
        </div>
      )}
    </div>
  )
}