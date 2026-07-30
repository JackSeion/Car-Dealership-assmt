import { useEffect, useState } from 'react'
import VehicleCard, { type Vehicle } from '../components/vehicles/VehicleCard'
import api from '../services/api'

const sectionClassName = 'space-y-6'
const controlsClassName = 'flex flex-col gap-4 sm:flex-row sm:flex-wrap'
const searchInputClassName = 'w-full rounded-lg border border-slate-300 px-4 py-2'
const categorySelectClassName = 'w-full rounded-lg border border-slate-300 px-4 py-2 sm:w-56'
const vehicleGridClassName = 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
const PURCHASE_ERROR_MESSAGE = 'Unable to purchase vehicle'

type SortOption = '' | 'make-asc' | 'price-asc' | 'price-desc'

type VehicleFilters = {
  searchQuery: string
  category: string
  minimumPrice: string
  maximumPrice: string
}

type VehicleComparator = (firstVehicle: Vehicle, secondVehicle: Vehicle) => number

const filterVehicles = (vehicles: Vehicle[], filters: VehicleFilters) => {
  const searchTerm = filters.searchQuery.toLowerCase()
  const minimumPrice = filters.minimumPrice === '' ? undefined : Number(filters.minimumPrice)
  const maximumPrice = filters.maximumPrice === '' ? undefined : Number(filters.maximumPrice)

  return vehicles.filter((vehicle) => {
    const matchesSearch = [vehicle.make, vehicle.model, vehicle.category].some((value) =>
      value.toLowerCase().includes(searchTerm)
    )
    const matchesCategory = filters.category === '' || vehicle.category === filters.category
    const matchesMinimumPrice = minimumPrice === undefined || vehicle.price >= minimumPrice
    const matchesMaximumPrice = maximumPrice === undefined || vehicle.price <= maximumPrice

    return matchesSearch && matchesCategory && matchesMinimumPrice && matchesMaximumPrice
  })
}

const vehicleComparators: Record<Exclude<SortOption, ''>, VehicleComparator> = {
  'make-asc': (firstVehicle, secondVehicle) => firstVehicle.make.localeCompare(secondVehicle.make),
  'price-asc': (firstVehicle, secondVehicle) => firstVehicle.price - secondVehicle.price,
  'price-desc': (firstVehicle, secondVehicle) => secondVehicle.price - firstVehicle.price,
}

const sortVehicles = (vehicles: Vehicle[], sortOption: SortOption) => {
  if (sortOption === '') {
    return vehicles
  }

  return [...vehicles].sort(vehicleComparators[sortOption])
}

const replaceVehicle = (vehicles: Vehicle[], updatedVehicle: Vehicle) =>
  vehicles.map((vehicle) =>
    vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
  )

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [minimumPrice, setMinimumPrice] = useState('')
  const [maximumPrice, setMaximumPrice] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('')
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [activePurchaseId, setActivePurchaseId] = useState<string | null>(null)
  const [purchaseError, setPurchaseError] = useState('')

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

  const handlePurchase = async (vehicleId: string) => {
    if (activePurchaseId) {
      return
    }

    setActivePurchaseId(vehicleId)
    setPurchaseError('')

    try {
      const { data: updatedVehicle } = await api.post<Vehicle>(`/api/vehicles/${vehicleId}/purchase`)
      setVehicles((currentVehicles) => replaceVehicle(currentVehicles, updatedVehicle))
    } catch {
      setPurchaseError(PURCHASE_ERROR_MESSAGE)
    } finally {
      setActivePurchaseId(null)
    }
  }

  if (isLoading) {
    return <p>Loading vehicles...</p>
  }

  if (hasError) {
    return <p>Unable to load vehicles</p>
  }

  const categoryOptions = [...new Set(vehicles.map((vehicle) => vehicle.category))]
  const filteredVehicles = filterVehicles(vehicles, {
    searchQuery,
    category: selectedCategory,
    minimumPrice,
    maximumPrice,
  })
  const displayedVehicles = sortVehicles(filteredVehicles, sortOption)

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setMinimumPrice('')
    setMaximumPrice('')
    setSortOption('')
  }

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
          placeholder="Filter by category"
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
        >
          <option value="">All Categories</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <input
          aria-label="Minimum price"
          className={categorySelectClassName}
          min="0"
          placeholder="Minimum price"
          type="number"
          value={minimumPrice}
          onChange={(event) => setMinimumPrice(event.target.value)}
        />
        <input
          aria-label="Maximum price"
          className={categorySelectClassName}
          min="0"
          placeholder="Maximum price"
          type="number"
          value={maximumPrice}
          onChange={(event) => setMaximumPrice(event.target.value)}
        />
        <select
          aria-label="Sort vehicles"
          className={categorySelectClassName}
          value={sortOption}
          onChange={(event) => setSortOption(event.target.value as SortOption)}
        >
          <option value="">None</option>
          <option value="make-asc">Make (A-Z)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
        <button
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
          type="button"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>

      {purchaseError && <p className="text-sm text-red-600">{purchaseError}</p>}

      {vehicles.length === 0 ? (
        <p>No vehicles available</p>
      ) : displayedVehicles.length === 0 ? (
        <p>No matching vehicles found</p>
      ) : (
        <div className={vehicleGridClassName} data-testid="vehicle-grid">
          {displayedVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              isPurchasePending={activePurchaseId === vehicle.id}
              onPurchase={() => handlePurchase(vehicle.id)}
              vehicle={vehicle}
            />
          ))}
        </div>
      )}
    </section>
  )
}
