// Organization Types
export type OrganizationType = 'GCC' | 'DCC' | 'LCC' | 'LC'

export interface Organization {
  id: string
  name: string
  type: OrganizationType
  parentId?: string
  parent?: Organization
  children?: Organization[]
  createdAt: Date
  updatedAt: Date
}

// Role Types
export type RoleType = 
  // GCC Roles
  | 'President' | 'Vice President' | 'General Secretary' | 'Assistant GS' | 'Treasurer' | 'Financial Secretary'
  // DCC Roles
  | 'Chairman' | 'Assistant Chairman' | 'Secretary' | 'Assistant Secretary' | 'Treasurer' | 'Delegate' | 'Financial Secretary'
  // LCC Roles
  | 'Local Overseer' | 'Assistant LO' | 'Secretary' | 'Treasurer' | 'Assistant Treasurer' | 'Financial Secretary' | 'Delegate'
  // LC Roles
  | 'Senior Minister' | 'Associate Minister' | 'Pastoral Team' | 'Elder' | 'Secretary' | 'Assistant Secretary' | 'Treasurer' | 'Financial Secretary' | 'CEL' | 'Discipleship Elder'
  // Agency Roles
  | 'Agency Leader' | 'Agency Secretary' | 'Agency Treasurer'
  // HR Roles
  | 'HR Administrator' | 'Accountant' | 'Staff' | 'Auditor'

export interface User {
  id: string
  email: string
  name: string
  firstName: string
  lastName: string
  phone: string
  role: RoleType
  organizationId: string
  organizationName: string
  organizationType: OrganizationType
  permissions: Permission[]
  createdAt: Date
  updatedAt: Date
}

// Permission System
export type PermissionType = 
  | 'read' | 'write' | 'delete' | 'approve' | 'audit'
  | 'financial_read' | 'financial_write' | 'financial_approve'
  | 'hr_read' | 'hr_write' | 'hr_approve'
  | 'org_create' | 'org_manage' | 'org_delete'

export interface Permission {
  id: string
  type: PermissionType
  resource: string
  granted: boolean
}

// Expenditure Types
export type ExpenditureStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'disbursed'
export type ExpenditureType = 'general' | 'agency' | 'project' | 'maintenance' | 'event'

export interface Expenditure {
  id: string
  title: string
  description: string
  amount: number
  type: ExpenditureType
  status: ExpenditureStatus
  requestedBy: string
  requestedByName: string
  organizationId: string
  organizationName: string
  agencyId?: string
  agencyName?: string
  bankName?: string
  accountNumber?: string
  beneficiaryName?: string
  approvalFlow: ApprovalStep[]
  createdAt: Date
  updatedAt: Date
}

export interface ApprovalStep {
  id: string
  step: number
  role: RoleType
  userId: string
  userName: string
  status: 'pending' | 'approved' | 'rejected'
  comments?: string
  timestamp: Date
}

// HR Types
export interface Staff {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: RoleType
  department: string
  employmentType: 'permanent' | 'temporary' | 'volunteer'
  startDate: Date
  salary: number
  allowances: Allowance[]
  organizationId: string
  organizationName: string
  createdAt: Date
  updatedAt: Date
}

export interface Allowance {
  id: string
  type: 'housing' | 'transport' | 'medical' | 'meal' | 'other'
  amount: number
  description?: string
}

export interface LeaveRequest {
  id: string
  staffId: string
  staffName: string
  type: 'annual' | 'sick' | 'maternity' | 'paternity' | 'emergency'
  startDate: Date
  endDate: Date
  days: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  approvedBy?: string
  approvedByName?: string
  comments?: string
  createdAt: Date
  updatedAt: Date
}

// Audit Types
export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  resourceId: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  timestamp: Date
}

// Account Types
export interface Account {
  id: string
  name: string
  type: 'church' | 'agency' | 'project' | 'savings'
  organizationId: string
  organizationName: string
  bankName: string
  accountNumber: string
  balance: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Transaction {
  id: string
  accountId: string
  accountName: string
  type: 'income' | 'expenditure' | 'transfer'
  amount: number
  description: string
  reference: string
  source?: string
  narration?: string
  reconciled: boolean
  createdAt: Date
  updatedAt: Date
}

// Dashboard Types
export interface DashboardData {
  totalOrganizations: number
  totalMembers: number
  totalIncome: number
  totalExpenditure: number
  pendingApprovals: number
  recentActivities: Activity[]
  financialSummary: FinancialSummary[]
  organizationStats: OrganizationStats
}

export interface Activity {
  id: string
  type: string
  description: string
  user: string
  timestamp: Date
}

export interface FinancialSummary {
  period: string
  income: number
  expenditure: number
  balance: number
}

export interface OrganizationStats {
  gcc: number
  dcc: number
  lcc: number
  lc: number
}
