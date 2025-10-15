#!/usr/bin/env node

// API Testing Script for ChurchFlow
// This script tests all the API endpoints to ensure they're working correctly

const BASE_URL = 'http://localhost:3000'

const testEndpoints = [
  // Authentication endpoints
  { method: 'POST', path: '/api/auth/signin', data: { email: 'admin@churchflow.com', password: 'password' } },
  { method: 'POST', path: '/api/auth/signup', data: { firstName: 'Test', lastName: 'User', email: 'test@example.com', password: 'password', organizationType: 'LC', organizationName: 'Test Church' } },
  
  // Dashboard endpoint
  { method: 'GET', path: '/api/dashboard' },
  
  // Organization endpoints
  { method: 'GET', path: '/api/organizations' },
  { method: 'POST', path: '/api/organizations', data: { name: 'Test Organization', type: 'LC', isActive: true } },
  
  // Expenditure endpoints
  { method: 'GET', path: '/api/expenditures' },
  { method: 'POST', path: '/api/expenditures', data: { title: 'Test Expenditure', description: 'Test description', amount: 1000, type: 'general', requestedBy: 'test-user', organizationId: 'test-org' } },
  
  // Income endpoints
  { method: 'GET', path: '/api/income' },
  { method: 'POST', path: '/api/income', data: { type: 'offering', amount: 500, description: 'Test offering', source: 'Test source', recordedBy: 'test-user', organizationId: 'test-org' } },
  
  // HR endpoints
  { method: 'GET', path: '/api/hr/staff' },
  { method: 'POST', path: '/api/hr/staff', data: { firstName: 'Test', lastName: 'Staff', email: 'staff@example.com', phone: '+234 801 234 5678', role: 'Test Role', organizationId: 'test-org' } },
  
  // Account endpoints
  { method: 'GET', path: '/api/accounts' },
  { method: 'POST', path: '/api/accounts', data: { name: 'Test Account', type: 'church', organizationId: 'test-org', bankName: 'Test Bank', accountNumber: '1234567890', balance: 0 } },
]

async function testEndpoint(endpoint) {
  try {
    const url = `${BASE_URL}${endpoint.path}`
    const options = {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (endpoint.data) {
      options.body = JSON.stringify(endpoint.data)
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      console.log(`✅ ${endpoint.method} ${endpoint.path} - Status: ${response.status}`)
      return { success: true, status: response.status, data }
    } else {
      console.log(`❌ ${endpoint.method} ${endpoint.path} - Status: ${response.status} - Error: ${data.error || 'Unknown error'}`)
      return { success: false, status: response.status, error: data.error }
    }
  } catch (error) {
    console.log(`❌ ${endpoint.method} ${endpoint.path} - Network Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function runTests() {
  console.log('🚀 Starting API Endpoint Tests...\n')
  
  let passed = 0
  let failed = 0
  
  for (const endpoint of testEndpoints) {
    const result = await testEndpoint(endpoint)
    if (result.success) {
      passed++
    } else {
      failed++
    }
    // Add a small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  console.log(`\n📊 Test Results:`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`)
  
  if (failed === 0) {
    console.log('\n🎉 All API endpoints are working correctly!')
  } else {
    console.log('\n⚠️  Some API endpoints need attention.')
  }
}

// Check if we're running this script directly
if (require.main === module) {
  runTests().catch(console.error)
}

module.exports = { testEndpoint, runTests }
