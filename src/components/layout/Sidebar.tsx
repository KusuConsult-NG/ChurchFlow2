'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home,
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  Settings,
  Shield,
  Building2,
  CreditCard,
  UserCheck,
  BarChart3,
  Calendar,
  Bell,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Expenditures',
    href: '/expenditures',
    icon: DollarSign,
    children: [
      { name: 'New Request', href: '/expenditures/new' },
      { name: 'Pending', href: '/expenditures/pending' },
      { name: 'Approved', href: '/expenditures/approved' },
      { name: 'History', href: '/expenditures/history' },
    ]
  },
  {
    name: 'Income',
    href: '/income',
    icon: TrendingUp,
    children: [
      { name: 'Record Income', href: '/income/record' },
      { name: 'Tithe & Offering', href: '/income/tithe' },
      { name: 'Donations', href: '/income/donations' },
      { name: 'History', href: '/income/history' },
    ]
  },
  {
    name: 'Approvals',
    href: '/approvals',
    icon: Shield,
  },
  {
    name: 'HR Management',
    href: '/hr',
    icon: UserCheck,
    children: [
      { name: 'Staff Management', href: '/hr/staff' },
      { name: 'Payroll', href: '/hr/payroll' },
      { name: 'Leave Management', href: '/hr/leave' },
      { name: 'Queries', href: '/hr/queries' },
    ]
  },
  {
    name: 'Organizations',
    href: '/organizations',
    icon: Building2,
    children: [
      { name: 'Create Organization', href: '/organizations/create' },
      { name: 'Manage Leaders', href: '/organizations/leaders' },
      { name: 'Agencies & Groups', href: '/organizations/agencies' },
    ]
  },
  {
    name: 'Accounts',
    href: '/accounts',
    icon: CreditCard,
    children: [
      { name: 'New Account', href: '/accounts/new' },
      { name: 'View History', href: '/accounts/history' },
      { name: 'Generate Statements', href: '/accounts/statements' },
    ]
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart3,
    children: [
      { name: 'Financial Reports', href: '/reports/financial' },
      { name: 'Audit Reports', href: '/reports/audit' },
      { name: 'HR Reports', href: '/reports/hr' },
    ]
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    )
  }

  return (
    <div className="churchflow-sidebar w-64 min-h-screen p-4">
      <div className="space-y-2">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white">ChurchFlow</h1>
          <p className="text-sm text-gray-300">Church Management System</p>
        </div>

        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const isExpanded = expandedItems.includes(item.name)
            const hasChildren = item.children && item.children.length > 0

            return (
              <div key={item.name}>
                <Link
                  href={item.href}
                  scroll={false}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-white text-primary-500"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  )}
                  onClick={(e) => {
                    if (hasChildren) {
                      e.preventDefault()
                      toggleExpanded(item.name)
                    }
                  }}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                  {hasChildren && (
                    isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )
                  )}
                </Link>

                {hasChildren && isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        scroll={false}
                        className={cn(
                          "block px-3 py-2 text-sm rounded-md transition-colors",
                          pathname === child.href
                            ? "bg-white text-primary-500"
                            : "text-gray-400 hover:bg-gray-700 hover:text-white"
                        )}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
