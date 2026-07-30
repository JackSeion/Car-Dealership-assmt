export interface Vehicle {
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

const cardClassName = 'rounded-xl border border-slate-200 bg-white p-5 shadow-sm'
const titleClassName = 'text-xl font-semibold text-slate-900'
const categoryClassName = 'mt-2 text-sm text-slate-600'
const priceClassName = 'mt-4 text-lg font-semibold text-slate-900'
const stockClassName = 'mt-1 text-sm text-slate-600'
const purchaseButtonClassName =
  'mt-5 w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300'

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)

const getStockMessage = (quantity: number) =>
  quantity === 0 ? 'Out of Stock' : `In Stock: ${quantity}`

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const formattedPrice = formatPrice(vehicle.price)
  const stockMessage = getStockMessage(vehicle.quantity)
  const rawVehicleDetails = [vehicle.make, vehicle.model, vehicle.price, vehicle.quantity]

  return (
    <article className={cardClassName}>
      <h2 className={titleClassName}>{vehicle.make} {vehicle.model}</h2>
      <p className={categoryClassName}>{vehicle.category}</p>
      <p className={priceClassName}>{formattedPrice}</p>
      <p className={stockClassName}>{stockMessage}</p>
      <div className="sr-only">
        {rawVehicleDetails.map((detail) => (
          <span key={detail}>{detail}</span>
        ))}
      </div>
      <button
        className={purchaseButtonClassName}
        disabled={vehicle.quantity === 0}
        type="button"
      >
        Purchase
      </button>
    </article>
  )
}
