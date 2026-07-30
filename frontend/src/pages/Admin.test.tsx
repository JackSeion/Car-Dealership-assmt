import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Admin from './Admin'

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

const vehicles = [
  {
    id: 'vehicle-1',
    make: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    price: 25000,
    quantity: 5,
  },
  {
    id: 'vehicle-2',
    make: 'Honda',
    model: 'Civic',
    category: 'Sedan',
    price: 22000,
    quantity: 3,
  },
]

const mockUseAuth = vi.mocked(useAuth)
const mockGetVehicles = vi.mocked(api.get)
const mockCreateVehicle = vi.mocked(api.post)
const mockUpdateVehicle = vi.mocked(api.put)
const mockDeleteVehicle = vi.mocked(api.delete)

const renderAdmin = () => render(<Admin />)

describe('Admin Dashboard', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: { id: 'admin-1', email: 'admin@example.com', role: 'ADMIN' },
      isAuthenticated: true,
      login: vi.fn(async () => {}),
      logout: vi.fn(),
    })
    mockGetVehicles.mockResolvedValue({ data: vehicles })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('displays all vehicles', async () => {
    renderAdmin()

    expect(await screen.findByText('Toyota Camry')).toBeInTheDocument()
    expect(screen.getByText('Honda Civic')).toBeInTheDocument()
  })

  it('allows an admin to add a vehicle and updates the dashboard immediately', async () => {
    const newVehicle = {
      id: 'vehicle-3',
      make: 'Kia',
      model: 'Seltos',
      category: 'SUV',
      price: 22500,
      quantity: 4,
    }
    mockCreateVehicle.mockResolvedValue({ data: newVehicle })

    renderAdmin()

    fireEvent.click(await screen.findByRole('button', { name: /add vehicle/i }))
    fireEvent.change(screen.getByLabelText(/^make$/i), { target: { value: newVehicle.make } })
    fireEvent.change(screen.getByLabelText(/^model$/i), { target: { value: newVehicle.model } })
    fireEvent.change(screen.getByLabelText(/^category$/i), { target: { value: newVehicle.category } })
    fireEvent.change(screen.getByLabelText(/^price$/i), { target: { value: newVehicle.price } })
    fireEvent.change(screen.getByLabelText(/^quantity$/i), { target: { value: newVehicle.quantity } })
    fireEvent.click(screen.getByRole('button', { name: /^save vehicle$/i }))

    await waitFor(() => {
      expect(mockCreateVehicle).toHaveBeenCalledWith('/api/vehicles', {
        make: 'Kia',
        model: 'Seltos',
        category: 'SUV',
        price: 22500,
        quantity: 4,
      })
    })
    expect(await screen.findByText('Kia Seltos')).toBeInTheDocument()
  })

  it('allows an admin to edit a vehicle and updates the dashboard immediately', async () => {
    const updatedVehicle = { ...vehicles[0], price: 26000 }
    mockUpdateVehicle.mockResolvedValue({ data: updatedVehicle })

    renderAdmin()

    fireEvent.click(await screen.findByRole('button', { name: /edit toyota camry/i }))
    fireEvent.change(screen.getByLabelText(/^price$/i), { target: { value: '26000' } })
    fireEvent.click(screen.getByRole('button', { name: /^save vehicle$/i }))

    await waitFor(() => {
      expect(mockUpdateVehicle).toHaveBeenCalledWith('/api/vehicles/vehicle-1', {
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 26000,
        quantity: 5,
      })
    })
    expect(await screen.findByText('$26,000')).toBeInTheDocument()
  })

  it('allows an admin to delete a vehicle and updates the dashboard immediately', async () => {
    mockDeleteVehicle.mockResolvedValue({})

    renderAdmin()

    fireEvent.click(await screen.findByRole('button', { name: /delete honda civic/i }))

    await waitFor(() => {
      expect(mockDeleteVehicle).toHaveBeenCalledWith('/api/vehicles/vehicle-2')
    })
    expect(screen.queryByText('Honda Civic')).not.toBeInTheDocument()
  })

  it('displays validation errors for invalid form input', async () => {
    renderAdmin()

    fireEvent.click(await screen.findByRole('button', { name: /add vehicle/i }))
    fireEvent.click(screen.getByRole('button', { name: /^save vehicle$/i }))

    expect(screen.getByText('Make is required')).toBeInTheDocument()
  })

  it('prevents non-admin users from accessing the admin dashboard', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'user-1', email: 'user@example.com', role: 'USER' },
      isAuthenticated: true,
      login: vi.fn(async () => {}),
      logout: vi.fn(),
    })

    renderAdmin()

    expect(screen.getByText(/access denied/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /add vehicle/i })).not.toBeInTheDocument()
  })
})
