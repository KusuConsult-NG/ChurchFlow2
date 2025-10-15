'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Shield, 
  Search, 
  Filter, 
  Download,
  Eye,
  Calendar,
  User,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { AuditLog } from '@/types'

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Doe',
    action: 'CREATE_EXPENDITURE',
    resource: 'Expenditure',
    resourceId: 'exp1',
    details: {
      title: 'Youth Fellowship Event',
      amount: 150000,
      type: 'agency'
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Jane Smith',
    action: 'APPROVE_EXPENDITURE',
    resource: 'Expenditure',
    resourceId: 'exp1',
    details: {
      step: 1,
      role: 'CEL',
      comments: 'Approved for youth activities'
    },
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: new Date('2024-01-15T14:20:00Z')
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Mike Johnson',
    action: 'CREATE_STAFF',
    resource: 'Staff',
    resourceId: 'staff1',
    details: {
      firstName: 'Sarah',
      lastName: 'Wilson',
      role: 'Secretary',
      salary: 120000
    },
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: new Date('2024-01-14T09:15:00Z')
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'David Brown',
    action: 'UPDATE_ACCOUNT',
    resource: 'Account',
    resourceId: 'acc1',
    details: {
      field: 'balance',
      oldValue: 2000000,
      newValue: 2500000
    },
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: new Date('2024-01-13T16:45:00Z')
  },
  {
    id: '5',
    userId: 'user5',
    userName: 'Pastor James',
    action: 'LOGIN',
    resource: 'Authentication',
    resourceId: 'auth1',
    details: {
      loginMethod: 'email',
      success: true
    },
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: new Date('2024-01-13T08:00:00Z')
  }
]

export default function AuditTrailPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [resourceFilter, setResourceFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesAction = actionFilter === 'all' || log.action.includes(actionFilter)
    const matchesResource = resourceFilter === 'all' || log.resource === resourceFilter
    
    let matchesDate = true
    if (dateFilter !== 'all') {
      const logDate = new Date(log.timestamp)
      const now = new Date()
      switch (dateFilter) {
        case 'today':
          matchesDate = logDate.toDateString() === now.toDateString()
          break
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = logDate >= weekAgo
          break
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = logDate >= monthAgo
          break
      }
    }
    
    return matchesSearch && matchesAction && matchesResource && matchesDate
  })

  const getActionIcon = (action: string) => {
    if (action.includes('CREATE')) return <CheckCircle className="h-4 w-4 text-green-500" />
    if (action.includes('UPDATE')) return <Activity className="h-4 w-4 text-blue-500" />
    if (action.includes('DELETE')) return <AlertCircle className="h-4 w-4 text-red-500" />
    if (action.includes('APPROVE')) return <CheckCircle className="h-4 w-4 text-green-500" />
    if (action.includes('LOGIN')) return <User className="h-4 w-4 text-purple-500" />
    return <Activity className="h-4 w-4 text-gray-500" />
  }

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'bg-green-100 text-green-800'
    if (action.includes('UPDATE')) return 'bg-blue-100 text-blue-800'
    if (action.includes('DELETE')) return 'bg-red-100 text-red-800'
    if (action.includes('APPROVE')) return 'bg-green-100 text-green-800'
    if (action.includes('LOGIN')) return 'bg-purple-100 text-purple-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getResourceColor = (resource: string) => {
    switch (resource) {
      case 'Expenditure': return 'bg-orange-100 text-orange-800'
      case 'Staff': return 'bg-blue-100 text-blue-800'
      case 'Account': return 'bg-green-100 text-green-800'
      case 'Authentication': return 'bg-purple-100 text-purple-800'
      case 'Organization': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUniqueActions = () => {
    const actions = [...new Set(auditLogs.map(log => log.action.split('_')[0]))]
    return actions
  }

  const getUniqueResources = () => {
    const resources = [...new Set(auditLogs.map(log => log.resource))]
    return resources
  }

  const getTotalActions = () => auditLogs.length
  const getTodayActions = () => {
    const today = new Date().toDateString()
    return auditLogs.filter(log => new Date(log.timestamp).toDateString() === today).length
  }
  const getUniqueUsers = () => {
    const users = [...new Set(auditLogs.map(log => log.userId))]
    return users.length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-500">Audit Trail</h1>
          <p className="text-gray-600 mt-1">Complete audit log of all system activities</p>
        </div>
        <Button className="churchflow-primary">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Actions</p>
                <p className="text-2xl font-bold text-gray-900">{getTotalActions()}</p>
                <p className="text-xs text-gray-500">All time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Actions</p>
                <p className="text-2xl font-bold text-gray-900">{getTodayActions()}</p>
                <p className="text-xs text-gray-500">Last 24 hours</p>
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
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{getUniqueUsers()}</p>
                <p className="text-xs text-gray-500">Unique users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="churchflow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Security Events</p>
                <p className="text-2xl font-bold text-gray-900">
                  {auditLogs.filter(log => log.action.includes('LOGIN')).length}
                </p>
                <p className="text-xs text-gray-500">Login attempts</p>
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
                  placeholder="Search audit logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Actions</option>
                {getUniqueActions().map((action) => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
              <select
                value={resourceFilter}
                onChange={(e) => setResourceFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Resources</option>
                {getUniqueResources().map((resource) => (
                  <option key={resource} value={resource}>{resource}</option>
                ))}
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <Card key={log.id} className="churchflow-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getActionIcon(log.action)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {log.action.replace(/_/g, ' ')}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActionColor(log.action)}`}>
                        {log.action.split('_')[0]}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getResourceColor(log.resource)}`}>
                        {log.resource}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">User:</span>
                        <p className="font-semibold">{log.userName}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Resource ID:</span>
                        <p className="font-semibold">{log.resourceId}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">IP Address:</span>
                        <p className="font-semibold">{log.ipAddress}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Timestamp:</span>
                        <p className="font-semibold">
                          {log.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {Object.keys(log.details).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Details:</h5>
                        <div className="bg-gray-50 rounded-md p-3">
                          <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm" className="churchflow-secondary">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredLogs.length === 0 && (
        <Card className="churchflow-card">
          <CardContent className="p-12 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Audit Logs Found</h3>
            <p className="text-gray-500">No audit logs match your current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
