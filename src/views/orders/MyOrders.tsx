import React from "react"
import { OrdersView } from "./OrderList"
import { useGetMyOrdersQuery } from "../../store/orders"

export function MyOrders() {
  const { data: orders } = useGetMyOrdersQuery()

  return <OrdersView title={"My Orders"} orders={orders || []} mine />
}
