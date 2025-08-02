import React from "react"
import { OrdersViewPaginated } from "./OrderList"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { useTranslation } from "react-i18next"

export function RecentOrders() {
  const [contractor] = useCurrentOrg()
  const { t } = useTranslation()

  return (
    <OrdersViewPaginated
      title={t("recentOrders.title")}
      contractor={contractor?.spectrum_id}
    />
  )
}

export function AdminRecentOrders() {
  const { t } = useTranslation()

  return (
    <OrdersViewPaginated title={t("recentOrders.title")} />
  )
}
