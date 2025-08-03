import React from "react"
import { ImportFleetForm } from "../../views/fleet/ImportFleetForm"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { useTranslation } from "react-i18next"

export function ImportFleet() {
  const { t } = useTranslation()

  return (
    <ContainerGrid maxWidth={"lg"} sidebarOpen={true}>
      <HeaderTitle>{t("fleet.importFleet")}</HeaderTitle>

      <ImportFleetForm />
    </ContainerGrid>
  )
}
