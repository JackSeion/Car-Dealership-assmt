import { useEffect, useState } from 'react'
import api from '../services/api'

type Vehicle = {
  id: string
  make: string
  model: string
  category: string
  price: number
  quantity: number
}

type VehicleCardProps = {
  vehicle: Vehicle
}

function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <article>
      <h2>{vehicle.make} {vehicle.model}</h2>
    </article>
  )
}

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get<Vehicle[]>('/api/vehicles')
        setVehicles(response.data)
      } catch {
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  if (isLoading) {
    return <p>Loading vehicles...</p>
  }

  if (hasError) {
    return <p>Unable to load vehicles</p>
  }

  if (vehicles.length === 0) {
    return <p>No vehicles available</p>
  }

  return (
    <section>
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </section>
  )
}
