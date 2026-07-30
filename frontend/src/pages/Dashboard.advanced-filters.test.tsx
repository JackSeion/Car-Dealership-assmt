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
    category: 'Sedan',
    price: 22000,
    quantity: 3,
  },
  {
    id: 'vehicle-3',
    make: 'BMW',
    model: 'X5',
    category: 'SUV',
    price: 78000,
    quantity: 2,
  },
]

const mockGetVehicles = vi.mocked(api.get)

const getVehicleTitles = () =>
  screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)

describe('Dashboard advanced vehicle filters', () => {
  beforeEach(() => {
    mockGetVehicles.mockResolvedValue({ data: vehicles })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('displays only vehicles from the selected category', async () => {
    render(<Dashboard />)

    await screen.findByText('Toyota Camry')
    fireEvent.change(screen.getByRole('combobox', { name: /filter by category/i }), {
      target: { value: 'SUV' },
    })

    expect(screen.getByText('BMW X5')).toBeInTheDocument()
    expect(screen.queryByText('Toyota Camry')).not.toBeInTheDocument()
    expect(screen.queryByText('Honda Civic')).not.toBeInTheDocument()
  })

  it('hides vehicles below the entered minimum price', async () => {
    render(<Dashboard />)

    await screen.findByText('Toyota Camry')
    fireEvent.change(screen.getByLabelText(/minimum price/i), {
      target: { value: '30000' },
    })

    expect(screen.getByText('BMW X5')).toBeInTheDocument()
    expect(screen.queryByText('Toyota Camry')).not.toBeInTheDocument()
    expect(screen.queryByText('Honda Civic')).not.toBeInTheDocument()
  })

  it('hides vehicles above the entered maximum price', async () => {
    render(<Dashboard />)

    await screen.findByText('Toyota Camry')
    fireEvent.change(screen.getByLabelText(/maximum price/i), {
      target: { value: '30000' },
    })

    expect(screen.getByText('Toyota Camry')).toBeInTheDocument()
    expect(screen.getByText('Honda Civic')).toBeInTheDocument()
    expect(screen.queryByText('BMW X5')).not.toBeInTheDocument()
  })

  it('combines search, category, and price filters', async () => {
    render(<Dashboard />)

    await screen.findByText('Toyota Camry')
    fireEvent.change(screen.getByPlaceholderText(/search vehicles/i), {
      target: { value: 'Civic' },
    })
    fireEvent.change(screen.getByRole('combobox', { name: /filter by category/i }), {
      target: { value: 'Sedan' },
    })
    fireEvent.change(screen.getByLabelText(/minimum price/i), {
      target: { value: '20000' },
    })
    fireEvent.change(screen.getByLabelText(/maximum price/i), {
      target: { value: '23000' },
    })

    expect(screen.getByText('Honda Civic')).toBeInTheDocument()
    expect(screen.queryByText('Toyota Camry')).not.toBeInTheDocument()
    expect(screen.queryByText('BMW X5')).not.toBeInTheDocument()
  })

  it('sorts vehicles by make from A to Z', async () => {
    render(<Dashboard />)

    await screen.findByText('Toyota Camry')
    fireEvent.change(screen.getByLabelText(/sort vehicles/i), {
      target: { value: 'make-asc' },
    })

    expect(getVehicleTitles()).toEqual(['BMW X5', 'Honda Civic', 'Toyota Camry'])
  })

  it('sorts vehicles by price from low to high', async () => {
    render(<Dashboard />)

    await screen.findByText('Toyota Camry')
    fireEvent.change(screen.getByLabelText(/sort vehicles/i), {
      target: { value: 'price-asc' },
    })

    expect(getVehicleTitles()).toEqual(['Honda Civic', 'Toyota Camry', 'BMW X5'])
  })

  it('sorts vehicles by price from high to low', async () => {
    render(<Dashboard />)

    await screen.findByText('Toyota Camry')
    fireEvent.change(screen.getByLabelText(/sort vehicles/i), {
      target: { value: 'price-desc' },
    })

    expect(getVehicleTitles()).toEqual(['BMW X5', 'Toyota Camry', 'Honda Civic'])
  })

  it('restores the complete vehicle list when filters are cleared', async () => {
    render(<Dashboard />)

    await screen.findByText('Toyota Camry')
    fireEvent.change(screen.getByPlaceholderText(/search vehicles/i), {
      target: { value: 'Civic' },
    })
    fireEvent.click(screen.getByRole('button', { name: /clear filters/i }))

    expect(getVehicleTitles()).toEqual(['Toyota Camry', 'Honda Civic', 'BMW X5'])
  })
})
