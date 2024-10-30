import React from "react"
import { ImportFleetForm } from "../../views/fleet/ImportFleetForm"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { HeaderTitle } from "../../components/typography/HeaderTitle"

export function ImportFleet() {
  return (
    <ContainerGrid maxWidth={"lg"} sidebarOpen={true}>
      <HeaderTitle>Import Fleet</HeaderTitle>

      <ImportFleetForm />
    </ContainerGrid>
  )
}
