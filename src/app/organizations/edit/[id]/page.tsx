'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useToastHelpers } from '@/components/ui/toast'
import { apiClient } from '@/lib/api-client'
import { 
  Building2, 
  ArrowLeft, 
  Save, 
  Users,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import Link from 'next/link'
import { OrganizationType } from '@/types'

interface Organization {
  id: string
  name: string
  type: OrganizationType
  parentId?: string
  description?: string
  address?: string
  phone?: string
  email?: string
  secretaryName?: string
  secretaryEmail?: string
  secretaryPhone?: string
  isActive: boolean
}

export default function EditOrganizationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const toast = useToastHelpers()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: '' as OrganizationType | '',
    parentId: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    secretaryName: '',
    secretaryEmail: '',
    secretaryPhone: '',
    isActive: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const organizationTypes = [
    { value: 'GCC', label: 'General Church Council (GCC)', description: 'National Headquarters' },
    { value: 'DCC', label: 'District Church Council (DCC)', description: 'Regional Level' },
    { value: 'LCC', label: 'Local Church Council (LCC)', description: 'Sub-District Level' },
    { value: 'LC', label: 'Local Church (LC)', description: 'Congregation Level' }
  ]

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await apiClient.getOrganizations()
        if (response.success) {
          const org = response.data.find((o: Organization) => o.id === params.id)
          if (org) {
            setOrganization(org)
            setFormData({
              name: org.name || '',
              type: org.type || '',
              parentId: org.parentId || '',
              description: org.description || '',
              address: org.address || '',
              phone: org.phone || '',
              email: org.email || '',
              secretaryName: org.secretaryName || '',
              secretaryEmail: org.secretaryEmail || '',
              secretaryPhone: org.secretaryPhone || '',
              isActive: org.isActive
            })
          } else {
            toast.error('Error', 'Organization not found')
            router.push('/organizations')
          }
        }
      } catch (error) {
        console.error('Failed to fetch organization:', error)
        toast.error('Error', 'Failed to fetch organization')
        router.push('/organizations')
      } finally {
        setLoading(false)
      }
    }

    fetchOrganization()
  }, [params.id, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name) newErrors.name = 'Organization name is required'
    if (!formData.type) newErrors.type = 'Organization type is required'
    if (!formData.secretaryName) newErrors.secretaryName = 'Secretary name is required'
    if (!formData.secretaryEmail) newErrors.secretaryEmail = 'Secretary email is required'
    if (!formData.secretaryPhone) newErrors.secretaryPhone = 'Secretary phone is required'
    
    if (formData.secretaryEmail && !/\S+@\S+\.\S+/.test(formData.secretaryEmail)) {
      newErrors.secretaryEmail = 'Invalid email format'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsSubmitting(true)
    try {
      // Note: We don't have an update API endpoint yet, so we'll show a message
      toast.info('Info', 'Update functionality will be implemented with the backend API')
      // For now, just navigate back
      router.push('/organizations')
    } catch (error: any) {
      console.error('Failed to update organization:', error)
      toast.error('Error', 'Failed to update organization. Please try again.')
      setErrors({ general: 'Failed to update organization. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRequiredRoles = (type: OrganizationType) => {
    switch (type) {
      case 'GCC':
        return ['President', 'Vice President', 'General Secretary', 'Assistant GS', 'Treasurer', 'Financial Secretary']
      case 'DCC':
        return ['Chairman', 'Assistant Chairman', 'Secretary', 'Assistant Secretary', 'Treasurer', 'Delegate', 'Financial Secretary']
      case 'LCC':
        return ['Local Overseer', 'Assistant LO', 'Secretary', 'Treasurer', 'Assistant Treasurer', 'Financial Secretary', 'Delegate']
      case 'LC':
        return ['Senior Minister', 'Associate Minister', 'Secretary', 'Assistant Secretary', 'Treasurer', 'Financial Secretary', 'CEL', 'Discipleship Elder']
      default:
        return []
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading organization...</div>
  }

  if (!organization) {
    return <div className="flex justify-center items-center min-h-screen">Organization not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/organizations">
          <Button variant="outline" size="sm" className="churchflow-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Organizations
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-primary-500">Edit Organization</h1>
          <p className="text-gray-600 mt-1">Update organization information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Organization Details */}
        <Card className="churchflow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Organization Details
            </CardTitle>
            <CardDescription>
              Basic information about the organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., ChurchFlow GoodNews HighCost"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.type ? 'border-red-500' : ''}`}
                >
                  <option value="">Select organization type</option>
                  {organizationTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label} - {type.description}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Brief description of the organization..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Organization address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Organization email"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="rounded border-gray-300"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Organization is active
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Secretary Details */}
        <Card className="churchflow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Secretary Details
            </CardTitle>
            <CardDescription>
              Information about the organization secretary
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="secretaryName" className="block text-sm font-medium text-gray-700 mb-1">
                  Secretary Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="secretaryName"
                    name="secretaryName"
                    value={formData.secretaryName}
                    onChange={handleChange}
                    className={`pl-10 ${errors.secretaryName ? 'border-red-500' : ''}`}
                    placeholder="Full name"
                  />
                </div>
                {errors.secretaryName && (
                  <p className="mt-1 text-sm text-red-600">{errors.secretaryName}</p>
                )}
              </div>

              <div>
                <label htmlFor="secretaryEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Secretary Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="secretaryEmail"
                    name="secretaryEmail"
                    type="email"
                    value={formData.secretaryEmail}
                    onChange={handleChange}
                    className={`pl-10 ${errors.secretaryEmail ? 'border-red-500' : ''}`}
                    placeholder="Email address"
                  />
                </div>
                {errors.secretaryEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.secretaryEmail}</p>
                )}
              </div>

              <div>
                <label htmlFor="secretaryPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Secretary Phone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="secretaryPhone"
                    name="secretaryPhone"
                    value={formData.secretaryPhone}
                    onChange={handleChange}
                    className={`pl-10 ${errors.secretaryPhone ? 'border-red-500' : ''}`}
                    placeholder="Phone number"
                  />
                </div>
                {errors.secretaryPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.secretaryPhone}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Required Roles */}
        {formData.type && (
          <Card className="churchflow-card">
            <CardHeader>
              <CardTitle>Required Leadership Roles</CardTitle>
              <CardDescription>
                These roles will need to be filled for {formData.type} organizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {getRequiredRoles(formData.type as OrganizationType).map((role) => (
                  <div key={role} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="text-sm font-medium">{role}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="text-sm text-red-600 text-center">
            {errors.general}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link href="/organizations">
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
            {isSubmitting ? 'Updating...' : 'Update Organization'}
          </Button>
        </div>
      </form>
    </div>
  )
}
