import { Page } from "../../components/metadata/Page"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import React from "react"
import { ReceivedOffersArea } from "../../views/offers/ReceivedOffersArea"
import { Breadcrumbs, Link as MaterialLink, Grid } from "@mui/material"
import { Link } from "react-router-dom"

export function ReceivedOffersPage() {
  return (
    <Page title={"Received Offers"}>
      <ContainerGrid maxWidth={"xl"} sidebarOpen={true}>
        <Grid item xs={12}>
          <Breadcrumbs>
            <MaterialLink
              component={Link}
              to={"/dashboard"}
              underline="hover"
              color={"text.primary"}
            >
              Dashboard
            </MaterialLink>
            <MaterialLink
              component={Link}
              underline="hover"
              to={"/offers/received"}
              color={"text.primary"}
            >
              Received Offers
            </MaterialLink>
          </Breadcrumbs>
        </Grid>
        <HeaderTitle lg={12} xl={12}>
          Received Offers
        </HeaderTitle>

        <ReceivedOffersArea />
      </ContainerGrid>
    </Page>
  )
}
