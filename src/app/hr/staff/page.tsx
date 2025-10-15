'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useToastHelpers } from '@/components/ui/toast'
import { apiClient } from '@/lib/api-client'
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  User
} from 'lucide-react'

interface StaffMember {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  department: string
  hireDate: string
  salary: number
  status: 'active' | 'inactive' | 'terminated'
  organizationId: string
  createdAt: string
  updatedAt: string
}

export default function StaffManagementPage() {
  const router = useRouter()
  const toast = useToastHelpers()
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await apiClient.getStaff()
        if (response.success) {
          setStaffMembers(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch staff:', error)
        toast.error('Error', 'Failed to fetch staff members')
      } finally {
        setLoading(false)
      }
    }

    fetchStaff()
  }, [toast])

  const handleCreateNew = () => {
    router.push('/hr/staff/new')
  }

  const handleView = (staff: StaffMember) => {
    setSelectedStaff(staff)
  }

  const handleEdit = (staff: StaffMember) => {
    router.push(`/hr/staff/edit/${staff.id}`)
  }

  const handleDelete = async (staff: StaffMember) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        // Note: We don't have a delete API endpoint yet, so we'll just show a message
        toast.info('Info', 'Delete functionality will be implemented with the backend API')
      } catch (error) {
        console.error('Failed to delete staff member:', error)
        toast.error('Error', 'Failed to delete staff member')
      }
    }
  }

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = 
      staff.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || staff.role === roleFilter
    const matchesStatus = statusFilter === 'all' || staff.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-yellow-100 text-yellow-800'
      case 'terminated': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'pastor': return 'bg-purple-100 text-purple-800'
      case 'secretary': return 'bg-blue-100 text-blue-800'
      case 'treasurer': return 'bg-green-100 text-green-800'
      case 'usher': return 'bg-orange-100 text-orange-800'
      case 'musician': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading staff members...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-500">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage church staff members</p>
        </div>
        <Button className="churchflow-primary" onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Staff</p>
                <p className="text-2xl font-bold text-gray-900">
                  {staffMembers.filter(staff => staff.status === 'active').length}
                </p>
                <p className="text-xs text-gray-500">Currently employed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{staffMembers.length}</p>
                <p className="text-xs text-gray-500">All staff members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pastors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {staffMembers.filter(staff => staff.role.toLowerCase() === 'pastor').length}
                </p>
                <p className="text-xs text-gray-500">Spiritual leaders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {staffMembers.filter(staff => {
                    const hireDate = new Date(staff.hireDate)
                    const now = new Date()
                    return hireDate.getMonth() === now.getMonth() && hireDate.getFullYear() === now.getFullYear()
                  }).length}
                </p>
                <p className="text-xs text-gray-500">New hires</p>
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
                  placeholder="Search staff members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Roles</option>
                <option value="pastor">Pastor</option>
                <option value="secretary">Secretary</option>
                <option value="treasurer">Treasurer</option>
                <option value="usher">Usher</option>
                <option value="musician">Musician</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff List */}
      <div className="space-y-4">
        {filteredStaff.length === 0 ? (
          <Card className="churchflow-card">
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Staff Members</h3>
                <p className="text-gray-500 mb-4">No staff members match your current filters.</p>
                <Button className="churchflow-primary" onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Staff Member
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredStaff.map((staff) => (
            <Card key={staff.id} className="churchflow-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {staff.firstName} {staff.lastName}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(staff.role)}`}>
                          {staff.role}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(staff.status)}`}>
                          {staff.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Email:</span>
                          <p className="font-semibold">{staff.email}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Phone:</span>
                          <p className="font-semibold">{staff.phone}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Department:</span>
                          <p className="font-semibold">{staff.department}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Hire Date:</span>
                          <p className="font-semibold">{apiClient.formatDate(staff.hireDate)}</p>
                        </div>
                      </div>

                      <div className="mt-2">
                        <span className="text-gray-500 text-sm">Salary:</span>
                        <span className="ml-2 text-lg font-bold text-green-600">
                          {apiClient.formatCurrency(staff.salary)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="churchflow-secondary"
                      onClick={() => handleView(staff)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="churchflow-secondary"
                      onClick={() => handleEdit(staff)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(staff)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Staff Detail Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl churchflow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedStaff.firstName} {selectedStaff.lastName}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedStaff(null)}
                >
                  ×
                </Button>
              </CardTitle>
              <CardDescription>{selectedStaff.role} - {selectedStaff.department}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedStaff.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">{selectedStaff.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <p className="text-sm text-gray-900">{selectedStaff.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Department</label>
                  <p className="text-sm text-gray-900">{selectedStaff.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Hire Date</label>
                  <p className="text-sm text-gray-900">{apiClient.formatDate(selectedStaff.hireDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className="text-sm text-gray-900">{selectedStaff.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Salary</label>
                  <p className="text-sm text-gray-900">{apiClient.formatCurrency(selectedStaff.salary)}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  className="churchflow-secondary"
                  onClick={() => setSelectedStaff(null)}
                >
                  Close
                </Button>
                <Button 
                  className="churchflow-primary"
                  onClick={() => {
                    handleEdit(selectedStaff)
                    setSelectedStaff(null)
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
