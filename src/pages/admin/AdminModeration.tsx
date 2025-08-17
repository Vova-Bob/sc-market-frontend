import React from "react"
import { Page } from "../../components/metadata/Page"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { useTranslation } from "react-i18next"
import { AdminModerationView } from "../../views/admin/AdminModerationView"

export function AdminModeration() {
  const { t } = useTranslation()

  return (
    <Page title={t("admin.moderation", "Admin Moderation")}>
      <ContainerGrid maxWidth={"xl"} sidebarOpen={true}>
        <AdminModerationView />
      </ContainerGrid>
    </Page>
  )
}
