import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Dashboard from './Dashboard'
import api from '../services/api'

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

const vehicle = {
  id: 'vehicle-1',
  make: 'Toyota',
  model: 'Camry',
  category: 'Sedan',
  price: 25000,
  quantity: 2,
}

const mockGetVehicles = vi.mocked(api.get)
const mockPurchaseVehicle = vi.mocked(api.post)

describe('Dashboard vehicle purchase', () => {
  beforeEach(() => {
    mockGetVehicles.mockResolvedValue({ data: [vehicle] })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('sends a purchase request for the selected vehicle', async () => {
    mockPurchaseVehicle.mockResolvedValue({ data: { ...vehicle, quantity: 1 } })

    render(<Dashboard />)

    fireEvent.click(await screen.findByRole('button', { name: /purchase/i }))

    await waitFor(() => {
      expect(mockPurchaseVehicle).toHaveBeenCalledWith('/api/vehicles/vehicle-1/purchase')
    })
  })

  it('decreases the displayed stock quantity after a successful purchase', async () => {
    mockPurchaseVehicle.mockResolvedValue({ data: { ...vehicle, quantity: 1 } })

    render(<Dashboard />)

    fireEvent.click(await screen.findByRole('button', { name: /purchase/i }))

    expect(await screen.findByText('In Stock: 1')).toBeInTheDocument()
  })

  it('disables the purchase button when a successful purchase leaves no stock', async () => {
    mockPurchaseVehicle.mockResolvedValue({ data: { ...vehicle, quantity: 0 } })

    render(<Dashboard />)

    const purchaseButton = await screen.findByRole('button', { name: /purchase/i })
    fireEvent.click(purchaseButton)

    await waitFor(() => {
      expect(purchaseButton).toBeDisabled()
    })
    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
  })

  it('displays an error message when the purchase request fails', async () => {
    mockPurchaseVehicle.mockRejectedValue(new Error('Purchase request failed'))

    render(<Dashboard />)

    fireEvent.click(await screen.findByRole('button', { name: /purchase/i }))

    expect(await screen.findByText(/unable to purchase vehicle/i)).toBeInTheDocument()
  })

  it('temporarily disables the purchase button while the request is in progress', async () => {
    mockPurchaseVehicle.mockImplementation(() => new Promise(() => {}))

    render(<Dashboard />)

    const purchaseButton = await screen.findByRole('button', { name: /purchase/i })
    fireEvent.click(purchaseButton)

    expect(purchaseButton).toBeDisabled()
  })
})
