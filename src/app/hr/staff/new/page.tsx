'use client'

import React, { useState } from 'react'
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

export default function NewStaffPage() {
  const router = useRouter()
  const toast = useToastHelpers()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    hireDate: new Date().toISOString().split('T')[0],
    salary: '',
    status: 'active'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      toast.error('Authentication Error', 'You must be logged in to add staff')
      return
    }
    
    setIsSubmitting(true)
    try {
      const staffData = {
        ...formData,
        salary: parseFloat(formData.salary),
        organizationId: user.organizationId
      }

      const response = await apiClient.createStaff(staffData)
      if (response.success) {
        toast.success('Success', 'Staff member added successfully!')
        router.push('/hr/staff')
      } else {
        toast.error('Error', 'Failed to add staff member')
        setErrors({ general: 'Failed to add staff member' })
      }
    } catch (error: any) {
      console.error('Failed to add staff member:', error)
      toast.error('Error', 'Failed to add staff member. Please try again.')
      setErrors({ general: 'Failed to add staff member. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
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
          <h1 className="text-3xl font-bold text-primary-500">Add Staff Member</h1>
          <p className="text-gray-600 mt-1">Add a new staff member to the organization</p>
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
            {isSubmitting ? 'Adding...' : 'Add Staff Member'}
          </Button>
        </div>
      </form>
    </div>
  )
}
