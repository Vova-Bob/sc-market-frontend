import React from "react"
import { OrderStub } from "../../datatypes/Order"
import { OrdersView } from "./OrderList"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { useGetOrdersByContractorQuery } from "../../store/orders"

export function RecentOrders() {
  const [contractor] = useCurrentOrg()

  const { data: orders } = useGetOrdersByContractorQuery(
    contractor?.spectrum_id!,
    {
      skip: !contractor?.spectrum_id,
    },
  )

  return <OrdersView title={"Recent Orders"} orders={orders || []} />
}

export function AdminRecentOrders(props: { orders: OrderStub[] }) {
  return <OrdersView title={"Recent Orders"} orders={props.orders} />
}
