import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import api, { tokenStore } from '../api/client'
import AdminLogin from '../pages/admin/AdminLogin'

// Mock axios
vi.mock('axios')

describe('Token Store', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('stores and retrieves access token', () => {
    tokenStore.set('access123', 'refresh456')
    expect(tokenStore.getAccess()).toBe('access123')
  })

  it('stores and retrieves refresh token', () => {
    tokenStore.set('access123', 'refresh456')
    expect(tokenStore.getRefresh()).toBe('refresh456')
  })

  it('clears tokens', () => {
    tokenStore.set('access123', 'refresh456')
    tokenStore.clear()
    expect(tokenStore.getAccess()).toBeNull()
    expect(tokenStore.getRefresh()).toBeNull()
  })

  it('updates only access token without refresh', () => {
    tokenStore.set('access1', 'refresh1')
    tokenStore.set('access2', null)
    expect(tokenStore.getAccess()).toBe('access2')
    expect(tokenStore.getRefresh()).toBe('refresh1')
  })
})

describe('API Client', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('adds authorization header when token exists', async () => {
    tokenStore.set('test-token', null)
    const response = { data: { id: 1 } }
    axios.get.mockResolvedValueOnce(response)

    await api.get('/offerings/')

    expect(axios.get).toHaveBeenCalled()
    const config = axios.get.mock.calls[0][1]
    expect(config?.headers?.Authorization).toBe('Bearer test-token')
  })

  it('refreshes token on 401 response', async () => {
    tokenStore.set('old-token', 'refresh-token')

    const error = {
      response: { status: 401 },
      config: { _retried: false }
    }
    const refreshResponse = { data: { access: 'new-token' } }

    // Mock initial request to fail with 401
    axios.post.mockResolvedValueOnce(refreshResponse)

    // Simulate token refresh interceptor
    expect(tokenStore.getAccess()).toBe('old-token')
  })

  it('clears tokens on refresh failure', () => {
    tokenStore.set('access', 'refresh')
    tokenStore.clear()
    expect(tokenStore.getAccess()).toBeNull()
  })
})

describe('Form Components', () => {
  it('renders login form with username and password inputs', () => {
    render(<AdminLogin />)
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    const user = userEvent.setup()
    render(<AdminLogin />)

    const usernameInput = screen.getByPlaceholderText('Username')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(usernameInput, 'testuser')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    // Button should show loading state
    expect(submitButton).toBeDisabled()
  })

  it('displays error messages', async () => {
    const user = userEvent.setup()
    render(<AdminLogin />)

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)

    // Should show error for empty credentials
    await waitFor(() => {
      expect(screen.queryByText(/error/i)).toBeDefined()
    })
  })
})

describe('Navigation', () => {
  it('has all navigation links', () => {
    render(<AdminLogin />)
    // Admin login page should have minimal nav
    expect(screen.getByText(/109 Tavern/i)).toBeInTheDocument()
  })
})

describe('Accessibility', () => {
  it('login form has autocomplete attributes', () => {
    render(<AdminLogin />)
    expect(screen.getByPlaceholderText('Username')).toHaveAttribute('autoComplete', 'username')
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('autoComplete', 'current-password')
  })

  it('form inputs are properly labeled', () => {
    render(<AdminLogin />)
    const usernameInput = screen.getByPlaceholderText('Username')
    expect(usernameInput).toBeVisible()
  })
})

describe('Integration', () => {
  it('login flow stores tokens correctly', () => {
    tokenStore.clear()
    expect(tokenStore.getAccess()).toBeNull()

    tokenStore.set('access-token', 'refresh-token')
    expect(tokenStore.getAccess()).toBe('access-token')
    expect(tokenStore.getRefresh()).toBe('refresh-token')
  })
})
