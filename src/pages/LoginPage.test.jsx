import LoginPage from './LoginPage'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import { MemoryRouter } from 'react-router-dom'

// Mock the react-router-dom's useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

// Mock the login API call
global.fetch = vi.fn()

describe('LoginPage', () => {
  let store

  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks()
    
    // Create a fresh store for each test
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    })
    
    // Clear localStorage
    localStorage.clear()
  })

  function renderWithProviders(ui) {
    return render(
      <MemoryRouter>
        <Provider store={store}>
          {ui}
        </Provider>
      </MemoryRouter>
    )
  }

  it('renders the login form', () => {
    renderWithProviders(<LoginPage />)
    
    expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    // expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /create a new account/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /forgot your password/i })).toBeInTheDocument()
  })

  it('allows entering email and password', async () => {
    renderWithProviders(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    
    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    
    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('shows error message when login fails', async () => {
    // Mock a failed API response
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    })
    
    renderWithProviders(<LoginPage />)
    
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword')
    await userEvent.click(screen.getByRole('button', { name: 'Sign in', exact: true }));
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during login', async () => {
    // Mock a slow API response
    fetch.mockImplementationOnce(() => 
      new Promise((resolve) => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ token: 'fake-token' }),
        }), 500)
      )
    )
    
    renderWithProviders(<LoginPage />)
    
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    
    // Check for loading state
    expect(await screen.findByText(/signing in/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()
  })

  it('redirects to dashboard when token exists', async () => {
    // Set token in localStorage to simulate being logged in
    localStorage.setItem('token', 'fake-token')
    
    const mockNavigate = vi.fn()
    vi.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate)
    
    renderWithProviders(<LoginPage />)
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('disables submit button when loading', () => {
    // Set initial state with loading: true
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          user: null,
          token: null,
          loading: true,
          error: null,
          isAuthenticated: false,
        },
      },
    })
    
    renderWithProviders(<LoginPage />)
    
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()
  })

  it('shows social login buttons', () => {
    renderWithProviders(<LoginPage />)
    
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in with github/i })).toBeInTheDocument()
  })
})