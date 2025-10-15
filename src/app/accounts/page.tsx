'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  CreditCard, 
  Plus, 
  Eye, 
  Download,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Calendar,
  Banknote,
  Building2,
  Users,
  CheckCircle
} from 'lucide-react'
import { apiClient } from '@/lib/api-client'

interface Account {
  id: string
  name: string
  type: 'church' | 'agency' | 'project' | 'savings'
  organizationId: string
  bankName: string
  accountNumber: string
  balance: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Transaction {
  id: string
  accountId: string
  type: 'income' | 'expenditure' | 'transfer'
  amount: number
  description: string
  reference: string
  source?: string
  narration?: string
  reconciled: boolean
  createdAt: string
  updatedAt: string
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'accounts' | 'history' | 'statements'>('accounts')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAccount, setSelectedAccount] = useState<string>('')

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await apiClient.getAccounts()
        setAccounts(response.data)
      } catch (error) {
        console.error('Failed to fetch accounts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [])

  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.accountNumber.includes(searchTerm)
  )

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'church': return <Building2 className="h-4 w-4 text-blue-500" />
      case 'agency': return <Users className="h-4 w-4 text-green-500" />
      case 'project': return <TrendingUp className="h-4 w-4 text-purple-500" />
      case 'savings': return <Banknote className="h-4 w-4 text-orange-500" />
      default: return <CreditCard className="h-4 w-4 text-gray-500" />
    }
  }

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'church': return 'bg-blue-100 text-blue-800'
      case 'agency': return 'bg-green-100 text-green-800'
      case 'project': return 'bg-purple-100 text-purple-800'
      case 'savings': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'expenditure': return <TrendingDown className="h-4 w-4 text-red-500" />
      case 'transfer': return <CreditCard className="h-4 w-4 text-blue-500" />
      default: return <Banknote className="h-4 w-4 text-gray-500" />
    }
  }

  const getTotalBalance = () => {
    return accounts.reduce((sum, account) => sum + account.balance, 0)
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading accounts...</div>
  }

  const getReconciledTransactions = () => {
    return transactions.filter(transaction => transaction.reconciled).length
  }

  const tabs = [
    { id: 'accounts', label: 'Accounts', icon: CreditCard },
    { id: 'history', label: 'Transaction History', icon: Calendar },
    { id: 'statements', label: 'Generate Statements', icon: Download }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-500">Accounts Management</h1>
          <p className="text-gray-600 mt-1">Manage church bank accounts and transactions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="churchflow-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="churchflow-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Account
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">{apiClient.formatCurrency(getTotalBalance())}</p>
                <p className="text-xs text-gray-500">Across all accounts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Accounts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {accounts.filter(acc => acc.isActive).length}
                </p>
                <p className="text-xs text-gray-500">Total accounts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reconciled</p>
                <p className="text-2xl font-bold text-gray-900">{getReconciledTransactions()}</p>
                <p className="text-xs text-gray-500">Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="churchflow-card">
        <CardContent className="p-0">
          <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6 settings-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'accounts' && (
              <div className="space-y-4">
                {/* Search */}
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search accounts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="all">All Types</option>
                      <option value="church">Church</option>
                      <option value="agency">Agency</option>
                      <option value="project">Project</option>
                      <option value="savings">Savings</option>
                    </select>
                  </div>
                </div>

                {/* Accounts List */}
                <div className="space-y-4">
                  {filteredAccounts.map((account) => (
                    <Card key={account.id} className="churchflow-card">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {getAccountTypeIcon(account.type)}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {account.name}
                              </h3>
                              <p className="text-gray-600">{account.bankName}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAccountTypeColor(account.type)}`}>
                                  {account.type}
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  account.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {account.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Account Number:</span>
                                <span className="text-sm font-medium">{account.accountNumber}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Balance:</span>
                                <span className="text-lg font-bold text-gray-900">{apiClient.formatCurrency(account.balance)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Status:</span>
                                <span className={`text-sm font-medium ${account.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                  {account.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-3">
                              <Button variant="outline" size="sm" className="churchflow-secondary">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm" className="churchflow-secondary">
                                <Download className="h-4 w-4 mr-1" />
                                Statement
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Transaction History</h3>
                  <p className="text-gray-500">No transaction history available yet.</p>
                </div>
              </div>
            )}

            {activeTab === 'statements' && (
              <div className="space-y-4">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Generate Account Statement</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Account
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="">Choose an account</option>
                        {accounts.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.name} - {apiClient.formatCurrency(account.balance)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <Input type="date" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <Input type="date" />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" className="churchflow-secondary">
                        Cancel
                      </Button>
                      <Button className="churchflow-primary">
                        <Download className="h-4 w-4 mr-2" />
                        Generate Statement
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}