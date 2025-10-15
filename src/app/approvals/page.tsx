'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Calendar,
  User,
  DollarSign
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { apiClient } from '@/lib/api-client'

interface ApprovalItem {
  id: string
  title: string
  description: string
  amount: number
  type: 'general' | 'agency' | 'project' | 'maintenance' | 'event'
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'disbursed'
  requestedBy: string
  organizationId: string
  organizationName: string
  createdAt: string
  updatedAt: string
  approvalFlow: any[]
}

export default function ApprovalsPage() {
  const { user } = useAuth()
  const [approvals, setApprovals] = useState<ApprovalItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null)
  const [comment, setComment] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const response = await apiClient.getApprovals({
          organizationId: user?.organizationId
        })
        setApprovals(response.data.pendingApprovals.concat(response.data.approvalHistory))
      } catch (error) {
        console.error('Failed to fetch approvals:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchApprovals()
    }
  }, [user])

  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = 
      approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || approval.type === typeFilter
    const matchesStatus = statusFilter === 'all' || approval.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'general': return <DollarSign className="h-4 w-4 text-blue-500" />
      case 'agency': return <User className="h-4 w-4 text-purple-500" />
      case 'project': return <AlertCircle className="h-4 w-4 text-green-500" />
      case 'maintenance': return <AlertCircle className="h-4 w-4 text-orange-500" />
      case 'event': return <Calendar className="h-4 w-4 text-pink-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />
      case 'disbursed': return <CheckCircle className="h-4 w-4 text-blue-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
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

  const handleApprove = async (id: string) => {
    setActionLoading(id)
    try {
      await apiClient.approveExpenditure(id, 'approve', comment, user?.id)
      // Refresh the approvals list
      const response = await apiClient.getApprovals({
        organizationId: user?.organizationId
      })
      setApprovals(response.data.pendingApprovals.concat(response.data.approvalHistory))
      setComment('')
    } catch (error) {
      console.error('Failed to approve expenditure:', error)
      alert('Failed to approve expenditure. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (id: string) => {
    setActionLoading(id)
    try {
      await apiClient.approveExpenditure(id, 'reject', comment, user?.id)
      // Refresh the approvals list
      const response = await apiClient.getApprovals({
        organizationId: user?.organizationId
      })
      setApprovals(response.data.pendingApprovals.concat(response.data.approvalHistory))
      setComment('')
    } catch (error) {
      console.error('Failed to reject expenditure:', error)
      alert('Failed to reject expenditure. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const getCurrentStep = (approval: ApprovalItem) => {
    const pendingStep = approval.approvalFlow.find(step => step.status === 'pending')
    return pendingStep ? pendingStep.role : 'Completed'
  }

  const getPendingCount = () => approvals.filter(a => a.status === 'pending').length
  const getTotalAmount = () => approvals
    .filter(a => a.status === 'pending')
    .reduce((sum, a) => sum + a.amount, 0)

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading approvals...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-500">Approvals</h1>
          <p className="text-gray-600 mt-1">Review and approve pending requests</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="churchflow-secondary">
            <MessageSquare className="h-4 w-4 mr-2" />
            Bulk Actions
          </Button>
        </div>
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
                <p className="text-2xl font-bold text-gray-900">{getPendingCount()}</p>
                <p className="text-xs text-gray-500">Awaiting approval</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {apiClient.formatCurrency(getTotalAmount())}
                </p>
                <p className="text-xs text-gray-500">Pending expenditures</p>
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
                  {approvals.filter(a => a.status === 'approved').length}
                </p>
                <p className="text-xs text-gray-500">This month</p>
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
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{approvals
                    .filter(a => a.amount)
                    .reduce((sum, a) => sum + (a.amount || 0), 0)
                    .toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Pending expenditures</p>
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
                  placeholder="Search approvals..."
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
                <option value="general">General</option>
                <option value="agency">Agency</option>
                <option value="project">Project</option>
                <option value="maintenance">Maintenance</option>
                <option value="event">Event</option>
              </select>
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approvals List */}
      <div className="space-y-4">
        {filteredApprovals.map((approval) => (
          <Card key={approval.id} className="churchflow-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getTypeIcon(approval.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {approval.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(approval.type)}`}>
                        {approval.type}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(approval.status)}`}>
                        {approval.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{approval.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Requested by:</span>
                        <p className="font-semibold">{approval.requestedBy}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Organization:</span>
                        <p className="font-semibold">{approval.organizationName}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Progress:</span>
                        <p className="font-semibold">{getCurrentStep(approval)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Created:</span>
                        <p className="font-semibold">{apiClient.formatDate(approval.createdAt)}</p>
                      </div>
                    </div>

                    <div className="mt-2">
                      <span className="text-gray-500 text-sm">Amount:</span>
                      <span className="ml-2 text-lg font-bold text-red-600">
                        {apiClient.formatCurrency(approval.amount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="churchflow-secondary"
                    onClick={() => setSelectedApproval(approval)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  {approval.status === 'pending' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="churchflow-secondary"
                        onClick={() => handleApprove(approval.id)}
                        disabled={actionLoading === approval.id}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {actionLoading === approval.id ? 'Processing...' : 'Approve'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="churchflow-secondary"
                        onClick={() => handleReject(approval.id)}
                        disabled={actionLoading === approval.id}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        {actionLoading === approval.id ? 'Processing...' : 'Reject'}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Comments Section */}
              {approval.approvalFlow.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Comments:</h4>
                  <div className="space-y-2">
                    {approval.approvalFlow.map((step, index) => (
                      <div key={index} className="bg-gray-50 rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{step.role} ({step.userId})</span>
                          <span className="text-xs text-gray-500">
                            {apiClient.formatDate(step.timestamp)} - {step.status}
                          </span>
                        </div>
                        {step.comments && <p className="text-sm text-gray-600 mt-1">Comments: {step.comments}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Approval Detail Modal */}
      {selectedApproval && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl churchflow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedApproval.title}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedApproval(null)}
                >
                  ×
                </Button>
              </CardTitle>
              <CardDescription>{selectedApproval.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <p className="text-sm text-gray-900">{selectedApproval.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className="text-sm text-gray-900">{selectedApproval.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Requested By</label>
                  <p className="text-sm text-gray-900">{selectedApproval.requestedBy}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Organization</label>
                  <p className="text-sm text-gray-900">{selectedApproval.organizationName}</p>
                </div>
                {selectedApproval.amount && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Amount</label>
                    <p className="text-sm text-gray-900">₦{selectedApproval.amount.toLocaleString()}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  className="churchflow-secondary"
                  onClick={() => setSelectedApproval(null)}
                >
                  Close
                </Button>
                {selectedApproval.status === 'pending' && (
                  <>
                    <Button 
                      className="churchflow-primary"
                      onClick={() => {
                        handleApprove(selectedApproval.id)
                        setSelectedApproval(null)
                      }}
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      className="churchflow-secondary"
                      onClick={() => {
                        handleReject(selectedApproval.id)
                        setSelectedApproval(null)
                      }}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
