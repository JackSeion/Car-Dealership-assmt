import { FormEvent, useEffect, useState } from 'react'
import { type Vehicle } from '../components/vehicles/VehicleCard'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

type VehicleFormState = {
  make: string
  model: string
  category: string
  price: string
  quantity: string
}

type VehicleFormErrors = Partial<Record<keyof VehicleFormState, string>>

const createEmptyFormState = (): VehicleFormState => ({
  make: '',
  model: '',
  category: '',
  price: '',
  quantity: '',
})

const createFormStateFromVehicle = (vehicle: Vehicle): VehicleFormState => ({
  make: vehicle.make,
  model: vehicle.model,
  category: vehicle.category,
  price: String(vehicle.price),
  quantity: String(vehicle.quantity),
})

const buildVehiclePayload = (formState: VehicleFormState) => ({
  make: formState.make,
  model: formState.model,
  category: formState.category,
  price: Number(formState.price),
  quantity: Number(formState.quantity),
})

const getVehicleFormErrors = (formState: VehicleFormState) => {
  const nextErrors: VehicleFormErrors = {}

  if (!formState.make.trim()) {
    nextErrors.make = 'Make is required'
  }

  if (!formState.model.trim()) {
    nextErrors.model = 'Model is required'
  }

  if (!formState.category.trim()) {
    nextErrors.category = 'Category is required'
  }

  if (!formState.price.trim()) {
    nextErrors.price = 'Price is required'
  }

  if (!formState.quantity.trim()) {
    nextErrors.quantity = 'Quantity is required'
  }

  return nextErrors
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)

export default function Admin() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null)
  const [formState, setFormState] = useState<VehicleFormState>(createEmptyFormState)
  const [formErrors, setFormErrors] = useState<VehicleFormErrors>({})
  const [restockVehicleId, setRestockVehicleId] = useState<string | null>(null)
  const [restockQuantity, setRestockQuantity] = useState('')
  const [restockError, setRestockError] = useState('')
  const [isRestocking, setIsRestocking] = useState(false)

  useEffect(() => {
    if (!isAdmin) {
      setIsLoading(false)
      return
    }

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
  }, [isAdmin])

  const resetForm = () => {
    setIsFormOpen(false)
    setEditingVehicleId(null)
    setFormState(createEmptyFormState())
    setFormErrors({})
  }

  const resetRestockForm = () => {
    setRestockVehicleId(null)
    setRestockQuantity('')
    setRestockError('')
    setIsRestocking(false)
  }

  if (!isAdmin) {
    return <p>Access denied</p>
  }

  const openAddForm = () => {
    resetRestockForm()
    setEditingVehicleId(null)
    setFormState(createEmptyFormState())
    setFormErrors({})
    setIsFormOpen(true)
  }

  const openEditForm = (vehicle: Vehicle) => {
    resetRestockForm()
    setEditingVehicleId(vehicle.id)
    setFormState(createFormStateFromVehicle(vehicle))
    setFormErrors({})
    setIsFormOpen(true)
  }

  const openRestockForm = (vehicleId: string) => {
    setIsFormOpen(false)
    setEditingVehicleId(null)
    setFormState(createEmptyFormState())
    setFormErrors({})
    setRestockVehicleId(vehicleId)
    setRestockQuantity('')
    setRestockError('')
  }

  const closeRestockForm = () => {
    resetRestockForm()
  }

  const validateRestockQuantity = (value: string) => {
    if (!value.trim()) {
      return 'Quantity is required'
    }

    const quantity = Number(value)

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return 'Quantity must be a positive integer'
    }

    return ''
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = getVehicleFormErrors(formState)

    setFormErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const payload = buildVehiclePayload(formState)

    if (editingVehicleId) {
      const response = await api.put<Vehicle>(`/api/vehicles/${editingVehicleId}`, payload)
      setVehicles((currentVehicles) =>
        currentVehicles.map((vehicle) => (vehicle.id === response.data.id ? response.data : vehicle))
      )
      resetForm()
      return
    }

    const response = await api.post<Vehicle>('/api/vehicles', payload)
    setVehicles((currentVehicles) => [...currentVehicles, response.data])
    resetForm()
  }

  const handleRestockSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const quantityError = validateRestockQuantity(restockQuantity)
    setRestockError(quantityError)

    if (quantityError || !restockVehicleId) {
      return
    }

    setIsRestocking(true)

    try {
      const response = await api.post<Vehicle>(`/api/vehicles/${restockVehicleId}/restock`, {
        quantity: Number(restockQuantity),
      })

      setVehicles((currentVehicles) =>
        currentVehicles.map((vehicle) => (vehicle.id === response.data.id ? response.data : vehicle))
      )
      closeRestockForm()
    } catch (error: any) {
      setRestockError(error?.response?.data?.message || 'Unable to restock vehicle')
    } finally {
      setIsRestocking(false)
    }
  }

  const handleDelete = async (vehicleId: string) => {
    await api.delete(`/api/vehicles/${vehicleId}`)
    setVehicles((currentVehicles) => currentVehicles.filter((vehicle) => vehicle.id !== vehicleId))
  }

  if (isLoading) {
    return <p>Loading vehicles...</p>
  }

  if (hasError) {
    return <p>Unable to load vehicles</p>
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white"
          onClick={openAddForm}
          type="button"
        >
          Add Vehicle
        </button>
      </div>

      {restockVehicleId && (
        <form className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleRestockSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="restock-quantity">
              Quantity
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              id="restock-quantity"
              type="number"
              value={restockQuantity}
              onChange={(event) => {
                setRestockQuantity(event.target.value)
                setRestockError('')
              }}
            />
          </div>

          {restockError && <p className="text-sm text-red-600">{restockError}</p>}

          <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white" disabled={isRestocking} type="submit">
            Confirm
          </button>
          <button className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700" type="button" onClick={closeRestockForm}>
            Cancel
          </button>
        </form>
      )}

      {isFormOpen && (
        <form className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="make">
              Make
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              id="make"
              value={formState.make}
              onChange={(event) => setFormState((currentState) => ({ ...currentState, make: event.target.value }))}
            />
            {formErrors.make && <p className="mt-1 text-sm text-red-600">{formErrors.make}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="model">
              Model
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              id="model"
              value={formState.model}
              onChange={(event) => setFormState((currentState) => ({ ...currentState, model: event.target.value }))}
            />
            {formErrors.model && <p className="mt-1 text-sm text-red-600">{formErrors.model}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="category">
              Category
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              id="category"
              value={formState.category}
              onChange={(event) => setFormState((currentState) => ({ ...currentState, category: event.target.value }))}
            />
            {formErrors.category && <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="price">
              Price
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              id="price"
              type="number"
              value={formState.price}
              onChange={(event) => setFormState((currentState) => ({ ...currentState, price: event.target.value }))}
            />
            {formErrors.price && <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="quantity">
              Quantity
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              id="quantity"
              type="number"
              value={formState.quantity}
              onChange={(event) => setFormState((currentState) => ({ ...currentState, quantity: event.target.value }))}
            />
            {formErrors.quantity && <p className="mt-1 text-sm text-red-600">{formErrors.quantity}</p>}
          </div>

          <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white" type="submit">
            Save Vehicle
          </button>
        </form>
      )}

      {vehicles.length === 0 ? (
        <p>No vehicles available</p>
      ) : (
        <table className="w-full border-collapse rounded-xl border border-slate-200 bg-white shadow-sm">
          <thead>
            <tr className="text-left">
              <th className="border-b border-slate-200 px-4 py-3">Vehicle</th>
              <th className="border-b border-slate-200 px-4 py-3">Category</th>
              <th className="border-b border-slate-200 px-4 py-3">Price</th>
              <th className="border-b border-slate-200 px-4 py-3">Quantity</th>
              <th className="border-b border-slate-200 px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td className="border-b border-slate-200 px-4 py-3">{vehicle.make} {vehicle.model}</td>
                <td className="border-b border-slate-200 px-4 py-3">{vehicle.category}</td>
                <td className="border-b border-slate-200 px-4 py-3">{formatPrice(vehicle.price)}</td>
                <td className="border-b border-slate-200 px-4 py-3">
                  {vehicle.quantity}
                  <span className="sr-only">In Stock: {vehicle.quantity}</span>
                </td>
                <td className="border-b border-slate-200 px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium"
                      onClick={() => openRestockForm(vehicle.id)}
                      type="button"
                    >
                      Restock {vehicle.make} {vehicle.model}
                    </button>
                    <button
                      className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium"
                      onClick={() => openEditForm(vehicle)}
                      type="button"
                    >
                      Edit {vehicle.make} {vehicle.model}
                    </button>
                    <button
                      className="rounded-lg border border-red-300 px-3 py-1 text-sm font-medium text-red-700"
                      onClick={() => handleDelete(vehicle.id)}
                      type="button"
                    >
                      Delete {vehicle.make} {vehicle.model}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
