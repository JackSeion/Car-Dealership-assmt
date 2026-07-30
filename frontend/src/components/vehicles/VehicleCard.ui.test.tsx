import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import VehicleCard from './VehicleCard'

const vehicle = {
  id: 'vehicle-1',
  make: 'Toyota',
  model: 'Camry',
  category: 'Sedan',
  price: 25000,
  quantity: 5,
}

describe('VehicleCard UI', () => {
  it('displays the vehicle make, model, and category', () => {
    render(<VehicleCard vehicle={vehicle} />)

    expect(screen.getByText('Toyota')).toBeInTheDocument()
    expect(screen.getByText('Camry')).toBeInTheDocument()
    expect(screen.getByText('Sedan')).toBeInTheDocument()
  })

  it('displays a formatted price and stock information', () => {
    render(<VehicleCard vehicle={vehicle} />)

    expect(screen.getByText('$25,000')).toBeInTheDocument()
    expect(screen.getByText('In Stock: 5')).toBeInTheDocument()
  })

  it('renders a purchase button', () => {
    render(<VehicleCard vehicle={vehicle} />)

    expect(screen.getByRole('button', { name: /purchase/i })).toBeInTheDocument()
  })

  it('disables the purchase button when the vehicle is out of stock', () => {
    render(<VehicleCard vehicle={{ ...vehicle, quantity: 0 }} />)

    expect(screen.getByRole('button', { name: /purchase/i })).toBeDisabled()
  })
})
