import { render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Dashboard from './Dashboard'
import api from '../services/api'

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
  },
}))

const mockGetVehicles = vi.mocked(api.get)

describe('Dashboard UI', () => {
  beforeEach(() => {
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
      ],
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the search bar', async () => {
    render(<Dashboard />)

    await screen.findByText('Toyota Camry')

    expect(screen.getByPlaceholderText(/search vehicles/i)).toBeInTheDocument()
  })

  it('renders the category filter', async () => {
    render(<Dashboard />)

    await screen.findByText('Toyota Camry')

    expect(screen.getByPlaceholderText(/filter by category/i)).toBeInTheDocument()
  })

  it('displays vehicle cards in a grid', async () => {
    render(<Dashboard />)

    const vehicleGrid = await screen.findByTestId('vehicle-grid')

    expect(vehicleGrid).toHaveClass('grid')
    expect(within(vehicleGrid).getByText('Toyota Camry')).toBeInTheDocument()
  })
})
