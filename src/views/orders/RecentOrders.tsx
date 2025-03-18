import React from "react"
import { OrdersViewPaginated } from "./OrderList"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"

export function RecentOrders() {
  const [contractor] = useCurrentOrg()

  return (
    <OrdersViewPaginated
      title={"Recent Orders"}
      contractor={contractor?.spectrum_id}
    />
  )
}

export function AdminRecentOrders() {
  return <OrdersViewPaginated title={"Recent Orders"} />
}
