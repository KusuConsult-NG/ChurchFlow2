'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  DollarSign, 
  Users, 
  Shield, 
  BarChart3, 
  Building2, 
  CreditCard,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading ChurchFlow...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-500">ChurchFlow</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/auth/signin')}
                className="churchflow-secondary"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => router.push('/auth/signup')}
                className="churchflow-primary"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Financial Management
              <span className="text-primary-500"> Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your church's financial operations with our comprehensive management system. 
              Track income, manage expenditures, and maintain transparency with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => router.push('/auth/signup')}
                className="churchflow-primary text-lg px-8 py-4"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => router.push('/auth/signin')}
                className="churchflow-secondary text-lg px-8 py-4"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Church Finances
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools you need to manage your church's financial operations effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="churchflow-card">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-primary-500 mb-4" />
                <CardTitle>Income Management</CardTitle>
                <CardDescription>
                  Track tithes, offerings, donations, and other income sources with detailed reporting.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="churchflow-card">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary-500 mb-4" />
                <CardTitle>Expenditure Control</CardTitle>
                <CardDescription>
                  Manage and approve expenditures with a robust approval workflow system.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="churchflow-card">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-primary-500 mb-4" />
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>
                  Generate comprehensive reports and analytics for better financial insights.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="churchflow-card">
              <CardHeader>
                <Users className="h-12 w-12 text-primary-500 mb-4" />
                <CardTitle>Staff Management</CardTitle>
                <CardDescription>
                  Manage church staff, payroll, and HR operations in one centralized system.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="churchflow-card">
              <CardHeader>
                <Building2 className="h-12 w-12 text-primary-500 mb-4" />
                <CardTitle>Organization Structure</CardTitle>
                <CardDescription>
                  Manage church hierarchy and organizational structure with role-based access.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="churchflow-card">
              <CardHeader>
                <CreditCard className="h-12 w-12 text-primary-500 mb-4" />
                <CardTitle>Account Management</CardTitle>
                <CardDescription>
                  Track multiple bank accounts and generate detailed financial statements.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How ChurchFlow Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign Up & Setup</h3>
              <p className="text-gray-600">
                Create your account, set up your organization structure, and invite your team members.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Configure & Customize</h3>
              <p className="text-gray-600">
                Set up your approval workflows, add bank accounts, and customize settings to match your needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Managing</h3>
              <p className="text-gray-600">
                Begin tracking income, processing expenditures, and generating comprehensive financial reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Churches Choose ChurchFlow
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Complete Transparency</h3>
                    <p className="text-gray-600">
                      Track every transaction with detailed audit trails and comprehensive reporting.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Multi-Level Approval</h3>
                    <p className="text-gray-600">
                      Set up customizable approval workflows for different types of expenditures.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Role-Based Access</h3>
                    <p className="text-gray-600">
                      Secure access control with different permission levels for different roles.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Real-Time Reports</h3>
                    <p className="text-gray-600">
                      Generate financial, audit, and HR reports instantly whenever you need them.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Easy to Use</h3>
                    <p className="text-gray-600">
                      Intuitive interface designed for church administrators with no technical expertise required.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-8">
                <BarChart3 className="h-48 w-48 text-primary-500 mx-auto" />
                <p className="text-center text-gray-700 mt-6">
                  "ChurchFlow has transformed how we manage our finances. The transparency and ease of use are unmatched."
                </p>
                <p className="text-center text-gray-900 font-semibold mt-4">
                  - Church Administrator
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Church's Financial Management?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of churches already using ChurchFlow to streamline their financial operations.
          </p>
          <Button 
            size="lg" 
            onClick={() => router.push('/auth/signup')}
            className="bg-white text-primary-500 hover:bg-gray-100 text-lg px-8 py-4"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">ChurchFlow</h3>
            <p className="text-gray-400 mb-6">
              Comprehensive financial management for churches
            </p>
            <div className="flex justify-center space-x-6">
              <Button 
                variant="outline" 
                onClick={() => router.push('/auth/signin')}
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => router.push('/auth/signup')}
                className="bg-primary-500 hover:bg-primary-600"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
