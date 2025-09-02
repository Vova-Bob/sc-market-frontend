import React from "react"
import { Page } from "../../components/metadata/Page"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { useTranslation } from "react-i18next"
import { AdminAlertsView } from "../../views/admin/AdminAlertsView"

export function AdminAlerts() {
  const { t } = useTranslation()

  return (
    <Page title={t("admin.alerts", "Admin Alerts")}>
      <ContainerGrid maxWidth={"xl"} sidebarOpen={true}>
        <AdminAlertsView />
      </ContainerGrid>
    </Page>
  )
}
