import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Dashboard from './Dashboard'
import api from '../services/api'

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
  },
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
    category: 'Coupe',
    price: 22000,
    quantity: 3,
  },
]

const mockGetVehicles = vi.mocked(api.get)

describe('Dashboard vehicle search', () => {
  beforeEach(() => {
    mockGetVehicles.mockResolvedValue({ data: vehicles })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('filters displayed vehicles when a vehicle make is typed', async () => {
    render(<Dashboard />)

    await screen.findByText('Toyota Camry')
    fireEvent.change(screen.getByPlaceholderText(/search vehicles/i), {
      target: { value: 'Toyota' },
    })

    expect(screen.getByText('Toyota Camry')).toBeInTheDocument()
    expect(screen.queryByText('Honda Civic')).not.toBeInTheDocument()
  })

  it('filters displayed vehicles when a vehicle model is typed', async () => {
    render(<Dashboard />)

    await screen.findByText('Toyota Camry')
    fireEvent.change(screen.getByPlaceholderText(/search vehicles/i), {
      target: { value: 'Civic' },
    })

    expect(screen.getByText('Honda Civic')).toBeInTheDocument()
    expect(screen.queryByText('Toyota Camry')).not.toBeInTheDocument()
  })

  it('filters displayed vehicles when a category is typed', async () => {
    render(<Dashboard />)

    await screen.findByText('Toyota Camry')
    fireEvent.change(screen.getByPlaceholderText(/search vehicles/i), {
      target: { value: 'Sedan' },
    })

    expect(screen.getByText('Toyota Camry')).toBeInTheDocument()
    expect(screen.queryByText('Honda Civic')).not.toBeInTheDocument()
  })

  it('restores all vehicles when the search input is cleared', async () => {
    render(<Dashboard />)

    await screen.findByText('Toyota Camry')
    const searchInput = screen.getByPlaceholderText(/search vehicles/i)
    fireEvent.change(searchInput, { target: { value: 'Toyota' } })
    fireEvent.change(searchInput, { target: { value: '' } })

    expect(screen.getByText('Toyota Camry')).toBeInTheDocument()
    expect(screen.getByText('Honda Civic')).toBeInTheDocument()
  })
})
