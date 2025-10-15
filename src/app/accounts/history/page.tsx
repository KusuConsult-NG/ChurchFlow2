'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { History } from 'lucide-react'

export default function AccountHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-500">Account History</h1>
          <p className="text-gray-600 mt-1">View transaction history for all accounts</p>
        </div>
      </div>

      <Card className="churchflow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2 text-blue-500" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Transaction History</h3>
            <p className="text-gray-500">No transaction history available yet.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
