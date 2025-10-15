// Database schema for ChurchFlow
// This file defines the database structure for the application

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: string
  organizationId: string
  password: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Organization {
  id: string
  name: string
  type: 'GCC' | 'DCC' | 'LCC' | 'LC'
  parentId?: string
  address?: string
  phone?: string
  email?: string
  secretaryName?: string
  secretaryEmail?: string
  secretaryPhone?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Expenditure {
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
  approvalFlow: ApprovalStep[]
  createdAt: Date
  updatedAt: Date
}

export interface ApprovalStep {
  id: string
  expenditureId: string
  step: number
  role: string
  userId: string
  status: 'pending' | 'approved' | 'rejected'
  comments?: string
  timestamp: Date
}

export interface Income {
  id: string
  type: 'tithe' | 'offering' | 'donation' | 'special' | 'other'
  amount: number
  description: string
  source: string
  date: Date
  recordedBy: string
  organizationId: string
  reference: string
  status: 'pending' | 'confirmed' | 'reconciled'
  createdAt: Date
  updatedAt: Date
}

export interface Staff {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  department: string
  employmentType: 'permanent' | 'temporary' | 'volunteer'
  startDate: Date
  salary: number
  allowances: Allowance[]
  organizationId: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Allowance {
  id: string
  staffId: string
  type: 'housing' | 'transport' | 'medical' | 'meal' | 'other'
  amount: number
  description?: string
}

export interface Account {
  id: string
  name: string
  type: 'church' | 'agency' | 'project' | 'savings'
  organizationId: string
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

export interface AuditLog {
  id: string
  userId: string
  action: string
  resource: string
  resourceId: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  timestamp: Date
}

// Mock database for development
export class MockDatabase {
  private users: User[] = []
  private organizations: Organization[] = []
  private expenditures: Expenditure[] = []
  private incomes: Income[] = []
  private staff: Staff[] = []
  private accounts: Account[] = []
  private transactions: Transaction[] = []
  private auditLogs: AuditLog[] = []

  constructor() {
    this.seedData()
  }

  private seedData() {
    // Seed organizations
    this.organizations = [
      {
        id: 'org-1',
        name: 'ChurchFlow Headquarters',
        type: 'GCC',
        address: 'Jos, Plateau State',
        phone: '+234 803 123 4567',
        email: 'hq@ecwa.org',
        secretaryName: 'John Admin',
        secretaryEmail: 'admin@ecwa.org',
        secretaryPhone: '+234 803 123 4567',
        isActive: true,
        createdAt: new Date('2020-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'org-2',
        name: 'ChurchFlow GoodNews HighCost',
        type: 'LC',
        parentId: 'org-1',
        address: 'HighCost, Jos',
        phone: '+234 803 765 4321',
        email: 'goodnews@ecwa.org',
        secretaryName: 'Jane Secretary',
        secretaryEmail: 'secretary@goodnews.org',
        secretaryPhone: '+234 803 765 4321',
        isActive: true,
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ]

    // Seed users
    this.users = [
      {
        id: 'user-1',
        email: 'admin@churchflow.com',
        firstName: 'Admin',
        lastName: 'User',
        phone: '+234 801 234 5678',
        role: 'Financial Secretary',
        organizationId: 'org-2',
        password: '$2b$10$example', // This would be hashed in real app
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ]

    // Seed accounts
    this.accounts = [
      {
        id: 'acc-1',
        name: 'ChurchFlow GoodNews Main Account',
        type: 'church',
        organizationId: 'org-2',
        bankName: 'Gowan Microfinance Bank',
        accountNumber: '1234567890',
        balance: 2500000,
        isActive: true,
        createdAt: new Date('2020-01-01'),
        updatedAt: new Date('2024-01-15')
      }
    ]

    // Seed expenditures
    this.expenditures = [
      {
        id: 'exp-1',
        title: 'Youth Fellowship Event',
        description: 'Annual youth conference and activities',
        amount: 150000,
        type: 'agency',
        status: 'pending',
        requestedBy: 'user-1',
        organizationId: 'org-2',
        agencyId: 'agency-1',
        approvalFlow: [
          {
            id: 'step-1',
            expenditureId: 'exp-1',
            step: 1,
            role: 'CEL',
            userId: 'user-2',
            status: 'approved',
            timestamp: new Date('2024-01-15')
          }
        ],
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-16')
      }
    ]

    // Seed incomes
    this.incomes = [
      {
        id: 'inc-1',
        type: 'offering',
        amount: 150000,
        description: 'Sunday Morning Offering',
        source: 'Congregation',
        date: new Date('2024-01-14'),
        recordedBy: 'user-1',
        organizationId: 'org-2',
        reference: 'OFF-2024-001',
        status: 'confirmed',
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14')
      }
    ]
  }

  // User methods
  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.users.push(newUser)
    return newUser
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null
  }

  // Organization methods
  async createOrganization(org: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>): Promise<Organization> {
    const newOrg: Organization = {
      ...org,
      id: `org-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.organizations.push(newOrg)
    return newOrg
  }

  async getOrganizations(): Promise<Organization[]> {
    return this.organizations
  }

  async getOrganizationById(id: string): Promise<Organization | null> {
    return this.organizations.find(org => org.id === id) || null
  }

  // Expenditure methods
  async createExpenditure(exp: Omit<Expenditure, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expenditure> {
    const newExp: Expenditure = {
      ...exp,
      id: `exp-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.expenditures.push(newExp)
    return newExp
  }

  async getExpenditures(): Promise<Expenditure[]> {
    return this.expenditures
  }

  async getExpenditureById(id: string): Promise<Expenditure | null> {
    return this.expenditures.find(exp => exp.id === id) || null
  }

  async updateExpenditure(id: string, updates: Partial<Expenditure>): Promise<Expenditure | null> {
    const index = this.expenditures.findIndex(exp => exp.id === id)
    if (index === -1) return null
    
    this.expenditures[index] = {
      ...this.expenditures[index],
      ...updates,
      updatedAt: new Date()
    }
    return this.expenditures[index]
  }

  // Income methods
  async createIncome(income: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>): Promise<Income> {
    const newIncome: Income = {
      ...income,
      id: `inc-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.incomes.push(newIncome)
    return newIncome
  }

  async getIncomes(): Promise<Income[]> {
    return this.incomes
  }

  async getIncomeById(id: string): Promise<Income | null> {
    return this.incomes.find(income => income.id === id) || null
  }

  // Staff methods
  async createStaff(staff: Omit<Staff, 'id' | 'createdAt' | 'updatedAt'>): Promise<Staff> {
    const newStaff: Staff = {
      ...staff,
      id: `staff-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.staff.push(newStaff)
    return newStaff
  }

  async getStaff(): Promise<Staff[]> {
    return this.staff
  }

  // Account methods
  async createAccount(account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    const newAccount: Account = {
      ...account,
      id: `acc-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.accounts.push(newAccount)
    return newAccount
  }

  async getAccounts(): Promise<Account[]> {
    return this.accounts
  }

  // Audit log methods
  async createAuditLog(log: Omit<AuditLog, 'id'>): Promise<AuditLog> {
    const newLog: AuditLog = {
      ...log,
      id: `log-${Date.now()}`
    }
    this.auditLogs.push(newLog)
    return newLog
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return this.auditLogs
  }
}

// Export singleton instance
export const db = new MockDatabase()
