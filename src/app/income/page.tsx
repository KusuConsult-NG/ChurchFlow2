'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  DollarSign, 
  Plus, 
  TrendingUp, 
  Calendar,
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  Upload,
  CreditCard,
  PiggyBank,
  Gift
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { apiClient } from '@/lib/api-client'

interface IncomeRecord {
  id: string
  type: 'tithe' | 'offering' | 'donation' | 'special' | 'other'
  amount: number
  description: string
  source: string
  date: string
  recordedBy: string
  organizationId: string
  reference: string
  status: 'pending' | 'confirmed' | 'reconciled'
  createdAt: string
  updatedAt: string
}

export default function IncomePage() {
  const { user } = useAuth()
  const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    description: '',
    source: '',
    date: new Date().toISOString().split('T')[0],
    reference: ''
  })

  useEffect(() => {
    const fetchIncomeRecords = async () => {
      try {
        const response = await apiClient.getIncomes()
        setIncomeRecords(response.data)
      } catch (error) {
        console.error('Failed to fetch income records:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchIncomeRecords()
  }, [])

  const filteredRecords = incomeRecords.filter(record => {
    const matchesSearch = 
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || record.type === typeFilter
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tithe': return <PiggyBank className="h-4 w-4 text-blue-500" />
      case 'offering': return <DollarSign className="h-4 w-4 text-green-500" />
      case 'donation': return <Gift className="h-4 w-4 text-purple-500" />
      case 'special': return <CreditCard className="h-4 w-4 text-orange-500" />
      default: return <DollarSign className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tithe': return 'bg-blue-100 text-blue-800'
      case 'offering': return 'bg-green-100 text-green-800'
      case 'donation': return 'bg-purple-100 text-purple-800'
      case 'special': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'reconciled': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTotalIncome = (type?: string) => {
    const filtered = type ? incomeRecords.filter(record => record.type === type) : incomeRecords
    return filtered.reduce((sum, record) => sum + record.amount, 0)
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading income records...</div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const incomeData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
        source: formData.source,
        date: formData.date,
        recordedBy: user?.id || 'unknown',
        organizationId: user?.organizationId || 'unknown',
        reference: formData.reference || `INC-${Date.now()}`
      }

      const response = await apiClient.createIncome(incomeData)
      setIncomeRecords([response.data, ...incomeRecords])
      setShowForm(false)
      setFormData({
        type: '',
        amount: '',
        description: '',
        source: '',
        date: new Date().toISOString().split('T')[0],
        reference: ''
      })
    } catch (error) {
      console.error('Failed to create income record:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-500">Income Management</h1>
          <p className="text-gray-600 mt-1">Record and track church income</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="churchflow-secondary">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button className="churchflow-primary" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Record Income
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-gray-900">{apiClient.formatCurrency(getTotalIncome())}</p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PiggyBank className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tithe</p>
                <p className="text-2xl font-bold text-gray-900">{apiClient.formatCurrency(getTotalIncome('tithe'))}</p>
                <p className="text-xs text-gray-500">Monthly collection</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Gift className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Donations</p>
                <p className="text-2xl font-bold text-gray-900">{apiClient.formatCurrency(getTotalIncome('donation'))}</p>
                <p className="text-xs text-gray-500">Special gifts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Growth</p>
                <p className="text-2xl font-bold text-gray-900">+15.2%</p>
                <p className="text-xs text-gray-500">vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="churchflow-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search income records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Types</option>
                <option value="tithe">Tithe</option>
                <option value="offering">Offering</option>
                <option value="donation">Donation</option>
                <option value="special">Special</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="reconciled">Reconciled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Income Records */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <Card key={record.id} className="churchflow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getTypeIcon(record.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {record.description}
                    </h3>
                    <p className="text-gray-600">{record.source}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(record.type)}`}>
                        {record.type}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        Ref: {record.reference}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">
                    {apiClient.formatCurrency(record.amount)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {apiClient.formatDate(record.date)}
                  </p>
                  <p className="text-sm text-gray-500">
                    By: {record.recordedBy}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button variant="outline" size="sm" className="churchflow-secondary">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="churchflow-secondary">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Income Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md churchflow-card">
            <CardHeader>
              <CardTitle>Record New Income</CardTitle>
              <CardDescription>Add a new income record to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Income Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="tithe">Tithe</option>
                    <option value="offering">Offering</option>
                    <option value="donation">Donation</option>
                    <option value="special">Special Collection</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount *
                  </label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief description"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source *
                  </label>
                  <Input
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    placeholder="Income source"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reference
                    </label>
                    <Input
                      value={formData.reference}
                      onChange={(e) => setFormData({...formData, reference: e.target.value})}
                      placeholder="REF-2024-001"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="churchflow-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="churchflow-primary">
                    Record Income
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
