import { Order } from "../../datatypes/Order"
import { AvailabilityDisplay } from "../../components/time/AvailabilitySelector"
import { convertAvailability } from "../../pages/availability/Availability"
import React from "react"
import { OfferSession } from "../../store/offer"
import { MinimalUser } from "../../datatypes/User"

export function OrderAvailabilityArea(props: { order: Order | OfferSession }) {
  const { order } = props
  const customerName =
    typeof order.customer === "string"
      ? order.customer
      : (order.customer as MinimalUser).display_name

  const assignedName =
    typeof order.assigned_to === "string"
      ? order.assigned_to
      : (order.assigned_to as MinimalUser)?.display_name

  return (
    <>
      <AvailabilityDisplay
        name={customerName}
        value={convertAvailability(order.availability!.customer)}
        lg={order.assigned_to && order.availability?.assigned ? 4 : 8}
      />
      {assignedName && order.availability?.assigned && (
        <AvailabilityDisplay
          name={assignedName}
          value={convertAvailability(order.availability!.assigned!)}
        />
      )}
    </>
  )
}
