import { HeaderTitle } from "../../components/typography/HeaderTitle"
import React from "react"
import { ActiveDeliveries } from "../../views/fleet/ActiveDeliveries"
import { Grid } from "@mui/material"
import { Ships } from "../../views/fleet/Ships"
import { ContainerGrid } from "../../components/layout/ContainerGrid"

export function Fleet() {
  return (
    <ContainerGrid maxWidth={"xxl"} sidebarOpen={true}>
      <HeaderTitle>Fleet</HeaderTitle>
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
