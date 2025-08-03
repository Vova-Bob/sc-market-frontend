import { HeaderTitle } from "../../components/typography/HeaderTitle"
import React from "react"
import { ActiveDeliveries } from "../../views/fleet/ActiveDeliveries"
import { Grid } from "@mui/material"
import { Ships } from "../../views/fleet/Ships"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { useTranslation } from "react-i18next"

export function Fleet() {
  const { t } = useTranslation()

  return (
    <ContainerGrid maxWidth={"xxl"} sidebarOpen={true}>
      <HeaderTitle>{t("fleet.fleetTitle")}</HeaderTitle>
      <Grid container xs={12} spacing={4} item>
        <Ships />
        <Grid item xs={12} xl={7} container spacing={4}>
          {/*<FleetBreakdown/>*/}
          <ActiveDeliveries />
        </Grid>
      </Grid>
    </ContainerGrid>
  )
}
