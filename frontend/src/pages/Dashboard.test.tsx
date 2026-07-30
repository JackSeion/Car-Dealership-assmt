import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Dashboard from './Dashboard'
import api from '../services/api'

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
  },
}))

const mockGetVehicles = vi.mocked(api.get)

describe('Dashboard', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows a loading indicator while vehicle data is being fetched', () => {
    mockGetVehicles.mockImplementation(() => new Promise(() => {}))

    render(<Dashboard />)

    expect(screen.getByText(/loading vehicles/i)).toBeInTheDocument()
  })

  it('renders vehicle cards after a successful API response', async () => {
    mockGetVehicles.mockResolvedValue({
      data: [
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
      ],
    })

    render(<Dashboard />)

    expect(await screen.findByText('Toyota Camry')).toBeInTheDocument()
    expect(screen.getByText('Honda Civic')).toBeInTheDocument()
  })

  it('shows an empty-state message when the API returns an empty array', async () => {
    mockGetVehicles.mockResolvedValue({ data: [] })

    render(<Dashboard />)

    expect(await screen.findByText(/no vehicles available/i)).toBeInTheDocument()
  })

  it('shows an error message if the vehicle request fails', async () => {
    mockGetVehicles.mockRejectedValue(new Error('Vehicle request failed'))

    render(<Dashboard />)

    expect(await screen.findByText(/unable to load vehicles/i)).toBeInTheDocument()
  })
})
