'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PiggyBank } from 'lucide-react'

export default function TitheOfferingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-500">Tithe & Offering</h1>
          <p className="text-gray-600 mt-1">Manage tithe and offering collections</p>
        </div>
      </div>

      <Card className="churchflow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <PiggyBank className="h-5 w-5 mr-2 text-blue-500" />
            Tithe & Offering Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <PiggyBank className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Records Found</h3>
            <p className="text-gray-500">No tithe and offering records available yet.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
