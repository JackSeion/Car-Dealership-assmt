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

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const details = [
    { label: 'Make', value: vehicle.make },
    { label: 'Model', value: vehicle.model },
    { label: 'Category', value: vehicle.category },
    { label: 'Price', value: vehicle.price },
    { label: 'Quantity', value: vehicle.quantity },
  ]

  return (
    <article>
      <h2>{vehicle.make} {vehicle.model}</h2>
      {details.map((detail) => (
        <p key={detail.label}>{detail.value}</p>
      ))}
      <button type="button">Purchase</button>
    </article>
  )
}
