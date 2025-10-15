'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useToastHelpers } from '@/components/ui/toast'
import { 
  Building2, 
  Plus, 
  Users, 
  Settings, 
  ChevronRight,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { apiClient } from '@/lib/api-client'

interface Organization {
  id: string
  name: string
  type: 'GCC' | 'DCC' | 'LCC' | 'LC'
  parentId?: string
  address?: string
  phone?: string
  email?: string
  secretaryName?: string
  secretaryEmail?: string
  secretaryPhone?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function OrganizationsPage() {
  const router = useRouter()
  const toast = useToastHelpers()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null)

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await apiClient.getOrganizations()
        if (response.success) {
          setOrganizations(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch organizations:', error)
        toast.error('Error', 'Failed to fetch organizations')
      } finally {
        setLoading(false)
      }
    }

    fetchOrganizations()
  }, [toast])

  const handleCreateNew = () => {
    router.push('/organizations/create')
  }

  const handleView = (organization: Organization) => {
    setSelectedOrganization(organization)
  }

  const handleEdit = (organization: Organization) => {
    router.push(`/organizations/edit/${organization.id}`)
  }

  const handleDelete = async (organization: Organization) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        // Note: We don't have a delete API endpoint yet, so we'll just show a message
        toast.info('Info', 'Delete functionality will be implemented with the backend API')
      } catch (error) {
        console.error('Failed to delete organization:', error)
        toast.error('Error', 'Failed to delete organization')
      }
    }
  }

  const handleManageLeaders = (organization: Organization) => {
    router.push(`/organizations/${organization.id}/leaders`)
  }

  const handleManageAgencies = (organization: Organization) => {
    router.push(`/organizations/${organization.id}/agencies`)
  }

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || org.type === filterType
    return matchesSearch && matchesFilter
  })

  const getOrganizationIcon = (type: string) => {
    switch (type) {
      case 'GCC': return '🏛️'
      case 'DCC': return '🏢'
      case 'LCC': return '🏘️'
      case 'LC': return '⛪'
      default: return '🏢'
    }
  }

  const getOrganizationColor = (type: string) => {
    switch (type) {
      case 'GCC': return 'bg-purple-100 text-purple-800'
      case 'DCC': return 'bg-blue-100 text-blue-800'
      case 'LCC': return 'bg-green-100 text-green-800'
      case 'LC': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getHierarchyLevel = (type: string) => {
    switch (type) {
      case 'GCC': return 1
      case 'DCC': return 2
      case 'LCC': return 3
      case 'LC': return 4
      default: return 0
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading organizations...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-500">Organizations</h1>
          <p className="text-gray-600 mt-1">Manage ChurchFlow organizational hierarchy</p>
        </div>
        <Button className="churchflow-primary" onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Create Organization
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">GCC</p>
                <p className="text-2xl font-bold text-gray-900">
                  {organizations.filter(org => org.type === 'GCC').length}
                </p>
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
                <p className="text-sm font-medium text-gray-600">DCC</p>
                <p className="text-2xl font-bold text-gray-900">
                  {organizations.filter(org => org.type === 'DCC').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">LCC</p>
                <p className="text-2xl font-bold text-gray-900">
                  {organizations.filter(org => org.type === 'LCC').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Building2 className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">LC</p>
                <p className="text-2xl font-bold text-gray-900">
                  {organizations.filter(org => org.type === 'LC').length}
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
                  placeholder="Search organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as string)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Types</option>
                <option value="GCC">GCC</option>
                <option value="DCC">DCC</option>
                <option value="LCC">LCC</option>
                <option value="LC">LC</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organizations List */}
      <div className="space-y-4">
        {filteredOrganizations.map((org) => (
          <Card key={org.id} className="churchflow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {getOrganizationIcon(org.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {org.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOrganizationColor(org.type)}`}>
                        {org.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        Level {getHierarchyLevel(org.type)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="churchflow-secondary"
                    onClick={() => handleView(org)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="churchflow-secondary"
                    onClick={() => handleManageLeaders(org)}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Leaders
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="churchflow-secondary"
                    onClick={() => handleManageAgencies(org)}
                  >
                    <Building2 className="h-4 w-4 mr-1" />
                    Agencies
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="churchflow-secondary"
                    onClick={() => handleEdit(org)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(org)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hierarchy Visualization */}
      <Card className="churchflow-card">
        <CardHeader>
          <CardTitle>Organizational Hierarchy</CardTitle>
          <CardDescription>
            Visual representation of ChurchFlow organizational structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['GCC', 'DCC', 'LCC', 'LC'].map((type, index) => (
              <div key={type} className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="text-lg">
                    {getOrganizationIcon(type)}
                  </div>
                  <span className="font-medium">{type}</span>
                </div>
                <div className="flex-1 flex items-center">
                  <div className="h-px bg-gray-300 flex-1"></div>
                  {index < 3 && (
                    <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {organizations.filter(org => org.type === type).length} organizations
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Organization Detail Modal */}
      {selectedOrganization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl churchflow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedOrganization.name}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedOrganization(null)}
                >
                  ×
                </Button>
              </CardTitle>
              <CardDescription>{selectedOrganization.type} Organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="text-sm text-gray-900">{selectedOrganization.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="text-sm text-gray-900">{selectedOrganization.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <p className="text-sm text-gray-900">{selectedOrganization.address || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">{selectedOrganization.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedOrganization.email || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Secretary</label>
                  <p className="text-sm text-gray-900">{selectedOrganization.secretaryName || 'Not assigned'}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  className="churchflow-secondary"
                  onClick={() => setSelectedOrganization(null)}
                >
                  Close
                </Button>
                <Button 
                  className="churchflow-primary"
                  onClick={() => {
                    handleEdit(selectedOrganization)
                    setSelectedOrganization(null)
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
