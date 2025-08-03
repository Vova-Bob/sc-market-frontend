import React from "react"
import { OrdersViewPaginated } from "../orders/OrderList"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { useTranslation } from "react-i18next"

export function MemberAssignments() {
  const [contractor] = useCurrentOrg()
  const { t } = useTranslation() // Get translation function

  return (
    <OrdersViewPaginated
      title={t("MemberAssignments.assignments")} // Localized title
      contractor={contractor?.spectrum_id}
      assigned
    />
  )
}
