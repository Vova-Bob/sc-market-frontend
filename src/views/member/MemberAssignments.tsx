import React from "react"
import { OrdersViewPaginated } from "../orders/OrderList"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"

export function MemberAssignments() {
  const [contractor] = useCurrentOrg()

  return (
    <OrdersViewPaginated
      title={"Assignments"}
      contractor={contractor?.spectrum_id}
      assigned
    />
  )
}
