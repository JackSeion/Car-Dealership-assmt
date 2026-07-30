import { useEffect, useState } from 'react'
import VehicleCard, { type Vehicle } from '../components/vehicles/VehicleCard'
import api from '../services/api'

const filterVehicles = (vehicles: Vehicle[], searchQuery: string) => {
  const normalizedQuery = searchQuery.toLowerCase()

  return vehicles.filter((vehicle) =>
    [vehicle.make, vehicle.model, vehicle.category].some((value) =>
      value.toLowerCase().includes(normalizedQuery)
    )
  )
}

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [searchQuery, setSearchQuery] = useState('')
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

  const filteredVehicles = filterVehicles(vehicles, searchQuery)

  return (
    <section>
      <input
        type="search"
        placeholder="Search vehicles"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />

      {vehicles.length === 0 ? (
        <p>No vehicles available</p>
      ) : filteredVehicles.length === 0 ? (
        <p>No matching vehicles found</p>
      ) : (
        filteredVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))
      )}
    </section>
  )
}