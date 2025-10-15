'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  UserCheck, 
  Plus, 
  Users, 
  DollarSign, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { apiClient } from '@/lib/api-client'

interface Staff {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  department: string
  employmentType: 'permanent' | 'temporary' | 'volunteer'
  startDate: string
  salary: number
  allowances: Allowance[]
  organizationId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Allowance {
  id: string
  staffId: string
  type: 'housing' | 'transport' | 'medical' | 'meal' | 'other'
  amount: number
  description?: string
}

interface LeaveRequest {
  id: string
  staffId: string
  staffName: string
  type: 'annual' | 'sick' | 'maternity' | 'emergency' | 'other'
  startDate: string
  endDate: string
  days: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  approvedBy?: string
  approvedByName?: string
  createdAt: string
  updatedAt: string
}

export default function HRPage() {
  const { user } = useAuth()
  const [staff, setStaff] = useState<Staff[]>([])
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'staff' | 'payroll' | 'leave' | 'queries'>('staff')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await apiClient.getStaff()
        setStaff(response.data)
      } catch (error) {
        console.error('Failed to fetch staff:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStaff()
  }, [])

  const filteredStaff = staff.filter(member => 
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case 'permanent': return 'bg-green-100 text-green-800'
      case 'temporary': return 'bg-yellow-100 text-yellow-800'
      case 'volunteer': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'bg-blue-100 text-blue-800'
      case 'sick': return 'bg-red-100 text-red-800'
      case 'maternity': return 'bg-pink-100 text-pink-800'
      case 'paternity': return 'bg-purple-100 text-purple-800'
      case 'emergency': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLeaveStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getTotalSalary = () => {
    return staff.reduce((sum, member) => sum + member.salary, 0)
  }

  const getTotalAllowances = () => {
    return staff.reduce((sum, member) => 
      sum + member.allowances.reduce((allowanceSum, allowance) => allowanceSum + allowance.amount, 0), 0
    )
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading HR data...</div>
  }

  const tabs = [
    { id: 'staff', label: 'Staff Management', icon: Users },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
    { id: 'leave', label: 'Leave Management', icon: Calendar },
    { id: 'queries', label: 'Queries', icon: UserCheck }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-500">HR Management</h1>
          <p className="text-gray-600 mt-1">Manage staff, payroll, and HR operations</p>
        </div>
        <Button className="churchflow-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
                <p className="text-xs text-gray-500">
                  {staff.filter(s => s.employmentType === 'permanent').length} permanent
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Salary</p>
                <p className="text-2xl font-bold text-gray-900">{apiClient.formatCurrency(getTotalSalary())}</p>
                <p className="text-xs text-gray-500">
                  +{apiClient.formatCurrency(getTotalAllowances())} allowances
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Leave</p>
                <p className="text-2xl font-bold text-gray-900">
                  {leaveRequests.filter(req => req.status === 'pending').length}
                </p>
                <p className="text-xs text-gray-500">Leave requests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Queries</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500">Open queries</p>
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

          <div className="p-6">
            {/* Staff Management Tab */}
            {activeTab === 'staff' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Staff Members</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search staff..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="churchflow-secondary">
                      <Filter className="h-4 w-4 mr-1" />
                      Filter
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredStaff.map((member) => (
                    <Card key={member.id} className="churchflow-card">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-primary-600 font-semibold text-lg">
                                {member.firstName[0]}{member.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                {member.firstName} {member.lastName}
                              </h4>
                              <p className="text-gray-600">{member.role}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEmploymentTypeColor(member.employmentType)}`}>
                                  {member.employmentType}
                                </span>
                                <span className="text-sm text-gray-500">
                                  Started: {new Date(member.startDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              {apiClient.formatCurrency(member.salary)}
                            </p>
                            <p className="text-sm text-gray-500">Monthly salary</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Button variant="outline" size="sm" className="churchflow-secondary">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm" className="churchflow-secondary">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
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

            {/* Leave Management Tab */}
            {activeTab === 'leave' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Leave Requests</h3>
                  <Button variant="outline" size="sm" className="churchflow-secondary">
                    <Plus className="h-4 w-4 mr-1" />
                    New Request
                  </Button>
                </div>

                <div className="space-y-4">
                  {leaveRequests.map((request) => (
                    <Card key={request.id} className="churchflow-card">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <Calendar className="h-6 w-6 text-gray-600" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                {request.staffName}
                              </h4>
                              <p className="text-gray-600">
                                {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Leave
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLeaveTypeColor(request.type)}`}>
                                  {request.type}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {request.days} days
                                </span>
                                <span className="text-sm text-gray-500">
                                  {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-2">
                              {getLeaveStatusIcon(request.status)}
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {request.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">
                              {request.reason}
                            </p>
                            {request.status === 'pending' && (
                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" className="churchflow-secondary">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button variant="outline" size="sm" className="churchflow-secondary">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Payroll Tab */}
            {activeTab === 'payroll' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Payroll Management</h3>
                  <Button variant="outline" size="sm" className="churchflow-secondary">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Generate Payroll
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="churchflow-card">
                    <CardHeader>
                      <CardTitle>Salary Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Salary:</span>
                          <span className="font-semibold">{apiClient.formatCurrency(getTotalSalary())}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Allowances:</span>
                          <span className="font-semibold">{apiClient.formatCurrency(getTotalAllowances())}</span>
                        </div>
                        <div className="flex justify-between border-t pt-3">
                          <span className="text-gray-600 font-semibold">Total Payroll:</span>
                          <span className="font-bold text-lg">{apiClient.formatCurrency(getTotalSalary() + getTotalAllowances())}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="churchflow-card">
                    <CardHeader>
                      <CardTitle>Recent Payroll</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">January 2024</p>
                            <p className="text-sm text-gray-500">Processed</p>
                          </div>
                          <span className="font-semibold">{apiClient.formatCurrency(getTotalSalary() + getTotalAllowances())}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">December 2023</p>
                            <p className="text-sm text-gray-500">Processed</p>
                          </div>
                          <span className="font-semibold">{apiClient.formatCurrency(getTotalSalary() + getTotalAllowances())}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Queries Tab */}
            {activeTab === 'queries' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">HR Queries</h3>
                  <Button variant="outline" size="sm" className="churchflow-secondary">
                    <Plus className="h-4 w-4 mr-1" />
                    Issue Query
                  </Button>
                </div>

                <Card className="churchflow-card">
                  <CardContent className="p-6 text-center">
                    <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Queries</h3>
                    <p className="text-gray-500">All HR queries have been resolved.</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
