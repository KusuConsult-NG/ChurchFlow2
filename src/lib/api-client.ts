// API Client utility for ChurchFlow
// This file provides a centralized way to make API calls

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002')

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    this.token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Ensure we have a valid base URL
    const baseURL = this.baseURL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002')
    const url = `${baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }))
        throw new Error(error.error || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error)
      throw error
    }
  }

  // Authentication methods
  async login(email: string, password: string) {
    return this.request<{ success: boolean; token: string; user: any }>('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async signup(userData: any) {
    return this.request<{ success: boolean; token: string; user: any }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async verifyToken() {
    return this.request<{ success: boolean; user: any }>('/api/auth/verify')
  }

  // Organization methods
  async getOrganizations() {
    return this.request<{ success: boolean; data: any[] }>('/api/organizations')
  }

  async createOrganization(organizationData: any) {
    return this.request<{ success: boolean; data: any }>('/api/organizations', {
      method: 'POST',
      body: JSON.stringify(organizationData),
    })
  }

  // Expenditure methods
  async getExpenditures() {
    return this.request<{ success: boolean; data: any[] }>('/api/expenditures')
  }

  async createExpenditure(expenditureData: any) {
    return this.request<{ success: boolean; data: any }>('/api/expenditures', {
      method: 'POST',
      body: JSON.stringify(expenditureData),
    })
  }

  async updateExpenditure(id: string, updateData: any) {
    return this.request<{ success: boolean; data: any }>(`/api/expenditures/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    })
  }

  async getExpenditureById(id: string) {
    return this.request<{ success: boolean; data: any }>(`/api/expenditures/${id}`)
  }

  // Income methods
  async getIncomes() {
    return this.request<{ success: boolean; data: any[] }>('/api/income')
  }

  async createIncome(incomeData: any) {
    return this.request<{ success: boolean; data: any }>('/api/income', {
      method: 'POST',
      body: JSON.stringify(incomeData),
    })
  }

  // HR methods
  async getStaff() {
    return this.request<{ success: boolean; data: any[] }>('/api/hr/staff')
  }

  async createStaff(staffData: any) {
    return this.request<{ success: boolean; data: any }>('/api/hr/staff', {
      method: 'POST',
      body: JSON.stringify(staffData),
    })
  }

  // Account methods
  async getAccounts() {
    return this.request<{ success: boolean; data: any[] }>('/api/accounts')
  }

  async createAccount(accountData: any) {
    return this.request<{ success: boolean; data: any }>('/api/accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    })
  }

  // Dashboard methods
  async getDashboardData() {
    return this.request<{ success: boolean; data: any }>('/api/dashboard')
  }

  // Reports methods
  async getReports(type: string = 'financial', params?: {
    startDate?: string
    endDate?: string
    organizationId?: string
  }) {
    const searchParams = new URLSearchParams()
    searchParams.set('type', type)
    
    if (params?.startDate) searchParams.set('startDate', params.startDate)
    if (params?.endDate) searchParams.set('endDate', params.endDate)
    if (params?.organizationId) searchParams.set('organizationId', params.organizationId)
    
    const queryString = searchParams.toString()
    const endpoint = queryString ? `/api/reports?${queryString}` : '/api/reports'
    
    return this.request<{ success: boolean; data: any }>(endpoint)
  }

  // Approvals methods
  async getApprovals(params?: {
    status?: string
    organizationId?: string
  }) {
    const searchParams = new URLSearchParams()
    
    if (params?.status) searchParams.set('status', params.status)
    if (params?.organizationId) searchParams.set('organizationId', params.organizationId)
    
    const queryString = searchParams.toString()
    const endpoint = queryString ? `/api/approvals?${queryString}` : '/api/approvals'
    
    return this.request<{ success: boolean; data: any }>(endpoint)
  }

  async approveExpenditure(expenditureId: string, action: 'approve' | 'reject', comments?: string, userId?: string) {
    return this.request<{ success: boolean; data: any }>('/api/approvals', {
      method: 'POST',
      body: JSON.stringify({
        expenditureId,
        action,
        comments,
        userId: userId || 'current-user' // This would come from auth context in real app
      }),
    })
  }

  // Utility methods
  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  // Currency formatting utility
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Date formatting utility
  formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date))
  }

  // Status color utility
  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'disbursed': return 'bg-blue-100 text-blue-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Type color utility
  getTypeColor(type: string): string {
    switch (type) {
      case 'general': return 'bg-blue-100 text-blue-800'
      case 'agency': return 'bg-purple-100 text-purple-800'
      case 'project': return 'bg-green-100 text-green-800'
      case 'maintenance': return 'bg-orange-100 text-orange-800'
      case 'event': return 'bg-pink-100 text-pink-800'
      case 'tithe': return 'bg-green-100 text-green-800'
      case 'offering': return 'bg-blue-100 text-blue-800'
      case 'donation': return 'bg-purple-100 text-purple-800'
      case 'special': return 'bg-yellow-100 text-yellow-800'
      case 'other': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export class for custom instances
export { ApiClient }
