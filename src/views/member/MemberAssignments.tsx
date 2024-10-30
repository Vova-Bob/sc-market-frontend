import React from "react"
import { OrdersView } from "../orders/OrderList"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import {
  useGetAllAssignedOrdersQuery,
  useGetAssignedOrdersByContractorQuery,
} from "../../store/orders"

export function MemberAssignments() {
  const [contractor] = useCurrentOrg()

  const { data: orders } = useGetAssignedOrdersByContractorQuery(
    contractor?.spectrum_id!,
    { skip: !contractor?.spectrum_id },
  )
  const { data: allOrders } = useGetAllAssignedOrdersQuery(undefined, {
    skip: !!contractor,
  })

  return (
    <OrdersView
      title={"Assignments"}
      orders={(contractor ? orders : allOrders) || []}
    />
  )
}
