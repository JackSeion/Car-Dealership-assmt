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

describe('VehicleCard', () => {
  it('displays the vehicle make', () => {
    render(<VehicleCard vehicle={vehicle} />)

    expect(screen.getByText('Toyota')).toBeInTheDocument()
  })

  it('displays the vehicle model', () => {
    render(<VehicleCard vehicle={vehicle} />)

    expect(screen.getByText('Camry')).toBeInTheDocument()
  })

  it('displays the vehicle category', () => {
    render(<VehicleCard vehicle={vehicle} />)

    expect(screen.getByText('Sedan')).toBeInTheDocument()
  })

  it('displays the vehicle price', () => {
    render(<VehicleCard vehicle={vehicle} />)

    expect(screen.getByText('25000')).toBeInTheDocument()
  })

  it('displays the vehicle quantity', () => {
    render(<VehicleCard vehicle={vehicle} />)

    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders a purchase button', () => {
    render(<VehicleCard vehicle={vehicle} />)

    expect(screen.getByRole('button', { name: /purchase/i })).toBeInTheDocument()
  })
})
