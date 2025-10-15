'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { apiClient } from '@/lib/api-client'
import { useRouter } from 'next/navigation'
import { useToastHelpers } from '@/components/ui/toast'

export default function RecordIncomePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const toast = useToastHelpers()
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    description: '',
    source: '',
    date: new Date().toISOString().split('T')[0]
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
    
    if (!formData.type || !formData.amount || !formData.description || !formData.source) {
      toast.error('Validation Error', 'Please fill in all required fields')
      return
    }

    if (!user) {
      toast.error('Authentication Error', 'You must be logged in to record income')
      return
    }

    setLoading(true)
    try {
      const incomeData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
        source: formData.source,
        date: formData.date,
        recordedBy: user.id,
        organizationId: user.organizationId
      }

      const response = await apiClient.createIncome(incomeData)
      
      if (response.success) {
        toast.success('Success!', 'Income recorded successfully!')
        router.push('/income')
      } else {
        toast.error('Error', 'Failed to record income')
      }
    } catch (error) {
      console.error('Error recording income:', error)
      toast.error('Error', 'An error occurred while recording the income')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-500">Record Income</h1>
          <p className="text-gray-600 mt-1">Record new income transactions</p>
        </div>
      </div>

      <Card className="churchflow-card">
        <CardHeader>
          <CardTitle>Income Recording Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Income Type *
              </label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select type</option>
                <option value="tithe">Tithe</option>
                <option value="offering">Offering</option>
                <option value="donation">Donation</option>
                <option value="special">Special Collection</option>
                <option value="other">Other</option>
              </select>
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
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
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
                placeholder="Enter income description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source *
              </label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter income source (e.g., Congregation, Individual donor)"
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                type="button"
                variant="outline" 
                className="churchflow-secondary"
                onClick={() => router.push('/income')}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="churchflow-primary"
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                {loading ? 'Recording...' : 'Record Income'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
