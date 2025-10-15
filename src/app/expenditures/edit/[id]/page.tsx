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
  ArrowLeft, 
  Save, 
  Banknote,
  Building2,
  User
} from 'lucide-react'
import Link from 'next/link'

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

export default function EditExpenditurePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const toast = useToastHelpers()
  const { user } = useAuth()
  const [expenditure, setExpenditure] = useState<Expenditure | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    type: '',
    bankName: '',
    accountNumber: '',
    beneficiaryName: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const expenditureTypes = [
    { value: 'general', label: 'General' },
    { value: 'agency', label: 'Agency' },
    { value: 'project', label: 'Project' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'event', label: 'Event' }
  ]

  useEffect(() => {
    const fetchExpenditure = async () => {
      try {
        const response = await apiClient.getExpenditures()
        if (response.success) {
          const exp = response.data.find((e: Expenditure) => e.id === params.id)
          if (exp) {
            setExpenditure(exp)
            setFormData({
              title: exp.title || '',
              description: exp.description || '',
              amount: exp.amount?.toString() || '',
              type: exp.type || '',
              bankName: exp.bankName || '',
              accountNumber: exp.accountNumber || '',
              beneficiaryName: exp.beneficiaryName || ''
            })
          } else {
            toast.error('Error', 'Expenditure not found')
            router.push('/expenditures')
          }
        }
      } catch (error) {
        console.error('Failed to fetch expenditure:', error)
        toast.error('Error', 'Failed to fetch expenditure')
        router.push('/expenditures')
      } finally {
        setLoading(false)
      }
    }

    fetchExpenditure()
  }, [params.id, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title) newErrors.title = 'Title is required'
    if (!formData.description) newErrors.description = 'Description is required'
    if (!formData.amount) newErrors.amount = 'Amount is required'
    if (!formData.type) newErrors.type = 'Type is required'
    
    if (formData.amount && isNaN(parseFloat(formData.amount))) {
      newErrors.amount = 'Amount must be a valid number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    if (!user) {
      toast.error('Authentication Error', 'You must be logged in to edit an expenditure')
      return
    }
    
    setIsSubmitting(true)
    try {
      const expenditureData = {
        title: formData.title,
        description: formData.description,
        amount: parseFloat(formData.amount),
        type: formData.type,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        beneficiaryName: formData.beneficiaryName
      }

      const response = await apiClient.updateExpenditure(params.id, expenditureData)
      
      if (response.success) {
        toast.success('Success!', 'Expenditure updated successfully!')
        router.push('/expenditures')
      } else {
        toast.error('Error', 'Failed to update expenditure')
        setErrors({ general: 'Failed to update expenditure' })
      }
    } catch (error) {
      console.error('Error updating expenditure:', error)
      toast.error('Error', 'An error occurred while updating the expenditure')
      setErrors({ general: 'An error occurred while updating the expenditure' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading expenditure...</div>
  }

  if (!expenditure) {
    return <div className="flex justify-center items-center min-h-screen">Expenditure not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/expenditures">
          <Button variant="outline" size="sm" className="churchflow-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Expenditures
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-primary-500">Edit Expenditure</h1>
          <p className="text-gray-600 mt-1">Update expenditure request information</p>
        </div>
      </div>

      <Card className="churchflow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Banknote className="h-5 w-5 mr-2" />
            Expenditure Request Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Enter expenditure title"
                required
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Enter expenditure description"
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₦) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.amount ? 'border-red-500' : ''}`}
                  placeholder="Enter amount"
                  required
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.type ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Select type</option>
                  {expenditureTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Bank name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Account number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beneficiary Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="beneficiaryName"
                    value={formData.beneficiaryName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Beneficiary name"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errors.general && (
              <div className="text-sm text-red-600 text-center">
                {errors.general}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link href="/expenditures">
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
                {isSubmitting ? 'Updating...' : 'Update Expenditure'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
