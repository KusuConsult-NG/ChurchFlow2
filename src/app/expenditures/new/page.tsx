'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { apiClient } from '@/lib/api-client'
import { useRouter } from 'next/navigation'
import { useToastHelpers } from '@/components/ui/toast'

export default function NewExpenditurePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const toast = useToastHelpers()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    type: '',
    bankName: '',
    accountNumber: '',
    beneficiaryName: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.amount || !formData.type) {
      toast.error('Validation Error', 'Please fill in all required fields')
      return
    }

    if (!user) {
      toast.error('Authentication Error', 'You must be logged in to create an expenditure')
      return
    }

    setLoading(true)
    try {
      const expenditureData = {
        title: formData.title,
        description: formData.description,
        amount: parseFloat(formData.amount),
        type: formData.type,
        requestedBy: user.id,
        organizationId: user.organizationId,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        beneficiaryName: formData.beneficiaryName
      }

      const response = await apiClient.createExpenditure(expenditureData)
      
      if (response.success) {
        toast.success('Success!', 'Expenditure request created successfully!')
        router.push('/expenditures')
      } else {
        toast.error('Error', 'Failed to create expenditure request')
      }
    } catch (error) {
      console.error('Error creating expenditure:', error)
      toast.error('Error', 'An error occurred while creating the expenditure request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-500">New Expenditure Request</h1>
          <p className="text-gray-600 mt-1">Create a new expenditure request</p>
        </div>
      </div>

      <Card className="churchflow-card">
        <CardHeader>
          <CardTitle>Expenditure Request Form</CardTitle>
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
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter expenditure title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="Enter expenditure description"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select type</option>
                  <option value="general">General</option>
                  <option value="agency">Agency</option>
                  <option value="project">Project</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="event">Event</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter bank name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter account number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beneficiary Name
              </label>
              <input
                type="text"
                name="beneficiaryName"
                value={formData.beneficiaryName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter beneficiary name"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                type="button"
                variant="outline" 
                className="churchflow-secondary"
                onClick={() => router.push('/expenditures')}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="churchflow-primary"
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
