'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useToastHelpers } from '@/components/ui/toast'
import { apiClient } from '@/lib/api-client'
import { 
  Banknote, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Filter,
  Search,
  Eye,
  Edit,
  MoreHorizontal,
  Trash2
} from 'lucide-react'

interface Expenditure {
  id: string
  title: string
  description: string
  amount: number
  type: 'general' | 'agency' | 'project' | 'maintenance' | 'event'
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'disbursed'
  requestedBy: string
  organizationId: string
  agencyId?: string
  bankName?: string
  accountNumber?: string
  beneficiaryName?: string
  approvalFlow: any[]
  createdAt: string
  updatedAt: string
}

export default function ExpendituresPage() {
  const router = useRouter()
  const toast = useToastHelpers()
  const [expenditures, setExpenditures] = useState<Expenditure[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedExpenditure, setSelectedExpenditure] = useState<Expenditure | null>(null)

  useEffect(() => {
    const fetchExpenditures = async () => {
      try {
        const response = await apiClient.getExpenditures()
        if (response.success) {
          setExpenditures(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch expenditures:', error)
        toast.error('Error', 'Failed to fetch expenditures')
      } finally {
        setLoading(false)
      }
    }

    fetchExpenditures()
  }, [toast])

  const handleCreateNew = () => {
    router.push('/expenditures/new')
  }

  const handleView = (expenditure: Expenditure) => {
    setSelectedExpenditure(expenditure)
  }

  const handleApprove = async (expenditure: Expenditure) => {
    try {
      const response = await apiClient.approveExpenditure(expenditure.id, 'approve', 'Approved by user')
      if (response.success) {
        toast.success('Success', 'Expenditure approved successfully')
        // Refresh the list
        const updatedResponse = await apiClient.getExpenditures()
        if (updatedResponse.success) {
          setExpenditures(updatedResponse.data)
        }
      } else {
        toast.error('Error', 'Failed to approve expenditure')
      }
    } catch (error) {
      console.error('Failed to approve expenditure:', error)
      toast.error('Error', 'Failed to approve expenditure')
    }
  }

  const handleEdit = (expenditure: Expenditure) => {
    router.push(`/expenditures/edit/${expenditure.id}`)
  }

  const handleDelete = async (expenditure: Expenditure) => {
    if (window.confirm('Are you sure you want to delete this expenditure?')) {
      try {
        // Note: We don't have a delete API endpoint yet, so we'll just show a message
        toast.info('Info', 'Delete functionality will be implemented with the backend API')
      } catch (error) {
        console.error('Failed to delete expenditure:', error)
        toast.error('Error', 'Failed to delete expenditure')
      }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const filteredExpenditures = expenditures.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || exp.status === statusFilter
    const matchesType = typeFilter === 'all' || exp.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />
      case 'disbursed': return <CheckCircle className="h-4 w-4 text-blue-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'disbursed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'general': return 'bg-blue-100 text-blue-800'
      case 'agency': return 'bg-purple-100 text-purple-800'
      case 'project': return 'bg-green-100 text-green-800'
      case 'maintenance': return 'bg-orange-100 text-orange-800'
      case 'event': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCurrentStep = (expenditure: Expenditure) => {
    const pendingStep = expenditure.approvalFlow.find(step => step.status === 'pending')
    return pendingStep ? pendingStep.role : 'Completed'
  }

  const getTotalAmount = (status?: string) => {
    const filtered = status ? expenditures.filter(exp => exp.status === status) : expenditures
    return filtered.reduce((sum, exp) => sum + exp.amount, 0)
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading expenditures...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-500">Expenditures</h1>
          <p className="text-gray-600 mt-1">Manage expenditure requests and approvals</p>
        </div>
        <Button className="churchflow-primary" onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {expenditures.filter(exp => exp.status === 'pending').length}
                </p>
                <p className="text-xs text-gray-500">
                  {formatCurrency(getTotalAmount('pending'))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {expenditures.filter(exp => exp.status === 'approved').length}
                </p>
                <p className="text-xs text-gray-500">
                  {formatCurrency(getTotalAmount('approved'))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Disbursed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {expenditures.filter(exp => exp.status === 'disbursed').length}
                </p>
                <p className="text-xs text-gray-500">
                  {formatCurrency(getTotalAmount('disbursed'))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Banknote className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(getTotalAmount())}
                </p>
                <p className="text-xs text-gray-500">
                  All expenditures
                </p>
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
                  placeholder="Search expenditures..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="disbursed">Disbursed</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Types</option>
                <option value="general">General</option>
                <option value="agency">Agency</option>
                <option value="project">Project</option>
                <option value="maintenance">Maintenance</option>
                <option value="event">Event</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenditures List */}
      <div className="space-y-4">
        {filteredExpenditures.map((expenditure) => (
          <Card key={expenditure.id} className="churchflow-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {expenditure.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(expenditure.status)}`}>
                      {expenditure.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(expenditure.type)}`}>
                      {expenditure.type}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{expenditure.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <p className="font-semibold">{formatCurrency(expenditure.amount)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Requested by:</span>
                      <p className="font-semibold">{expenditure.requestedBy}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Organization:</span>
                      <p className="font-semibold">{expenditure.organizationId}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Current Step:</span>
                      <p className="font-semibold">{getCurrentStep(expenditure)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="churchflow-secondary"
                    onClick={() => handleView(expenditure)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  {expenditure.status === 'pending' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="churchflow-secondary"
                      onClick={() => handleApprove(expenditure)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="churchflow-secondary"
                    onClick={() => handleEdit(expenditure)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(expenditure)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Approval Flow */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Approval Flow:</h4>
                <div className="flex items-center space-x-4">
                  {expenditure.approvalFlow.map((step, index) => (
                    <div key={step.id} className="flex items-center space-x-2">
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                        step.status === 'approved' ? 'bg-green-100 text-green-800' :
                        step.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {getStatusIcon(step.status)}
                        <span>{step.role}</span>
                      </div>
                      {index < expenditure.approvalFlow.length - 1 && (
                        <div className="w-4 h-px bg-gray-300"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Expenditure Detail Modal */}
      {selectedExpenditure && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl churchflow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedExpenditure.title}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedExpenditure(null)}
                >
                  ×
                </Button>
              </CardTitle>
              <CardDescription>{selectedExpenditure.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="text-sm text-gray-900">{selectedExpenditure.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="text-sm text-gray-900">{selectedExpenditure.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Amount</label>
                  <p className="text-sm text-gray-900">{formatCurrency(selectedExpenditure.amount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Requested By</label>
                  <p className="text-sm text-gray-900">{selectedExpenditure.requestedBy}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Organization</label>
                  <p className="text-sm text-gray-900">{selectedExpenditure.organizationId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Current Step</label>
                  <p className="text-sm text-gray-900">{getCurrentStep(selectedExpenditure)}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  className="churchflow-secondary"
                  onClick={() => setSelectedExpenditure(null)}
                >
                  Close
                </Button>
                <Button 
                  className="churchflow-primary"
                  onClick={() => {
                    handleEdit(selectedExpenditure)
                    setSelectedExpenditure(null)
                  }}
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
