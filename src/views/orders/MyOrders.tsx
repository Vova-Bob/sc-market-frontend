import React from "react"
import { OrdersViewPaginated } from "./OrderList"
import { useTranslation } from "react-i18next"

export function MyOrders() {
  const { t } = useTranslation()
  return <OrdersViewPaginated title={t("myOrders.title")} mine />
}
