'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useToastHelpers } from '@/components/ui/toast'
import { apiClient } from '@/lib/api-client'
import { useAuth } from '@/context/AuthContext'
import { 
  User, 
  ArrowLeft, 
  Save, 
  Mail,
  Phone,
  Calendar,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'

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

export default function EditStaffPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const toast = useToastHelpers()
  const { user } = useAuth()
  const [staff, setStaff] = useState<StaffMember | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    hireDate: '',
    salary: '',
    status: 'active'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const roles = [
    'Pastor',
    'Associate Pastor',
    'Secretary',
    'Treasurer',
    'Financial Secretary',
    'Usher',
    'Musician',
    'Choir Director',
    'Sunday School Teacher',
    'Youth Leader',
    'Elder',
    'Deacon',
    'Other'
  ]

  const departments = [
    'Ministry',
    'Administration',
    'Finance',
    'Music',
    'Youth',
    'Children',
    'Outreach',
    'Maintenance',
    'Security',
    'Other'
  ]

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await apiClient.getStaff()
        if (response.success) {
          const staffMember = response.data.find((s: StaffMember) => s.id === params.id)
          if (staffMember) {
            setStaff(staffMember)
            setFormData({
              firstName: staffMember.firstName || '',
              lastName: staffMember.lastName || '',
              email: staffMember.email || '',
              phone: staffMember.phone || '',
              role: staffMember.role || '',
              department: staffMember.department || '',
              hireDate: staffMember.hireDate || '',
              salary: staffMember.salary?.toString() || '',
              status: staffMember.status || 'active'
            })
          } else {
            toast.error('Error', 'Staff member not found')
            router.push('/hr/staff')
          }
        }
      } catch (error) {
        console.error('Failed to fetch staff member:', error)
        toast.error('Error', 'Failed to fetch staff member')
        router.push('/hr/staff')
      } finally {
        setLoading(false)
      }
    }

    fetchStaff()
  }, [params.id, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.phone) newErrors.phone = 'Phone number is required'
    if (!formData.role) newErrors.role = 'Role is required'
    if (!formData.department) newErrors.department = 'Department is required'
    if (!formData.salary) newErrors.salary = 'Salary is required'
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (formData.salary && isNaN(parseFloat(formData.salary))) {
      newErrors.salary = 'Salary must be a valid number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    if (!user) {
      toast.error('Authentication Error', 'You must be logged in to edit staff')
      return
    }
    
    setIsSubmitting(true)
    try {
      const staffData = {
        ...formData,
        salary: parseFloat(formData.salary),
        organizationId: user.organizationId
      }

      // Note: We don't have an update API endpoint yet, so we'll show a message
      toast.info('Info', 'Update functionality will be implemented with the backend API')
      // For now, just navigate back
      router.push('/hr/staff')
    } catch (error: any) {
      console.error('Failed to update staff member:', error)
      toast.error('Error', 'Failed to update staff member. Please try again.')
      setErrors({ general: 'Failed to update staff member. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading staff member...</div>
  }

  if (!staff) {
    return <div className="flex justify-center items-center min-h-screen">Staff member not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/hr/staff">
          <Button variant="outline" size="sm" className="churchflow-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Staff
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-primary-500">Edit Staff Member</h1>
          <p className="text-gray-600 mt-1">Update staff member information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card className="churchflow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="Enter phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card className="churchflow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Employment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.role ? 'border-red-500' : ''}`}
                >
                  <option value="">Select role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.department ? 'border-red-500' : ''}`}
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Hire Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="hireDate"
                    name="hireDate"
                    type="date"
                    value={formData.hireDate}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                  Salary *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="salary"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleChange}
                    className={`pl-10 ${errors.salary ? 'border-red-500' : ''}`}
                    placeholder="Enter salary amount"
                  />
                </div>
                {errors.salary && (
                  <p className="mt-1 text-sm text-red-600">{errors.salary}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {errors.general && (
          <div className="text-sm text-red-600 text-center">
            {errors.general}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link href="/hr/staff">
            <Button variant="outline" className="churchflow-secondary">
              Cancel
            </Button>
          </Link>
          <Button 
            type="submit" 
            className="churchflow-primary"
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Updating...' : 'Update Staff Member'}
          </Button>
        </div>
      </form>
    </div>
  )
}
