import { Order } from "../../datatypes/Order"
import { AvailabilityDisplay } from "../../components/time/AvailabilitySelector"
import { useCurrentOrder } from "../../hooks/order/CurrentOrder"
import { convertAvailability } from "../../pages/availability/Availability"

export function OrderAvailabilityArea(props: { order: Order }) {
  const { order } = props
  return (
    <>
      <AvailabilityDisplay
        name={order.customer}
        value={convertAvailability(order.availability!.customer)}
        lg={order.assigned_to && order.availability?.assigned ? 4 : 8}
      />
      {order.assigned_to && order.availability?.assigned && (
        <AvailabilityDisplay
          name={order.assigned_to}
          value={convertAvailability(order.availability!.assigned!)}
        />
      )}
    </>
  )
}
