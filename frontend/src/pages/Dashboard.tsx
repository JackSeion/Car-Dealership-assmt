import { useEffect, useState } from 'react'
import VehicleCard, { type Vehicle } from '../components/vehicles/VehicleCard'
import api from '../services/api'

const sectionClassName = 'space-y-6'
const controlsClassName = 'flex flex-col gap-4 sm:flex-row'
const searchInputClassName = 'w-full rounded-lg border border-slate-300 px-4 py-2'
const categorySelectClassName = 'w-full rounded-lg border border-slate-300 px-4 py-2 sm:w-56'
const vehicleGridClassName = 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'

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
    <section className={sectionClassName}>
      <div className={controlsClassName}>
        <input
          className={searchInputClassName}
          type="search"
          placeholder="Search vehicles"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        <select
          aria-label="Filter by category"
          className={categorySelectClassName}
          disabled
          placeholder="Filter by category"
        >
          <option>Filter by category</option>
        </select>
      </div>

      {vehicles.length === 0 ? (
        <p>No vehicles available</p>
      ) : filteredVehicles.length === 0 ? (
        <p>No matching vehicles found</p>
      ) : (
        <div className={vehicleGridClassName} data-testid="vehicle-grid">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </section>
  )
}
