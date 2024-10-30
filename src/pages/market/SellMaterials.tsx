import React from "react"
import { SellMaterialsList } from "../../views/market/SellMaterialsList"
import { Grid } from "@mui/material"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { Page } from "../../components/metadata/Page"

export function SellMaterials(props: {}) {
  return (
    <Page title={"Commodities"}>
      <ContainerGrid maxWidth={"lg"} sidebarOpen={true}>
        <HeaderTitle>We Buy Resources!</HeaderTitle>
        <HeaderTitle variant={"h6"} sx={{ fontWeight: "500" }}>
          Sell your resources in bulk with us! Skip the refining process and
          sell to us at a premium!
        </HeaderTitle>

        <Grid item container xs={12} lg={12}>
          <SellMaterialsList {...props} />
        </Grid>
      </ContainerGrid>
    </Page>
  )
}
