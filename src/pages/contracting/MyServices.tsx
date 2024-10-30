import React from "react"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { Button, Divider, Grid } from "@mui/material"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { CreateRounded } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { MyServices } from "../../views/orders/Services"
import { Page } from "../../components/metadata/Page"

export function MyServicesPage(props: {}) {
  return (
    <Page title={"My Services"}>
      <ContainerGrid maxWidth={"lg"} sidebarOpen={true}>
        <Grid
          item
          container
          justifyContent={"space-between"}
          spacing={2}
          xs={12}
        >
          <HeaderTitle lg={8} xl={8}>
            My Services
          </HeaderTitle>

          <Grid item>
            <Link
              to={"/order/service/create"}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <Button
                color={"secondary"}
                startIcon={<CreateRounded />}
                variant={"contained"}
                size={"large"}
              >
                Create Service
              </Button>
            </Link>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider light />
        </Grid>

        <Grid
          item
          container
          xs={12}
          lg={12}
          spacing={3}
          sx={{ transition: "0.3s" }}
        >
          <MyServices status={"active"} />
        </Grid>

        <Grid
          item
          container
          xs={12}
          lg={12}
          spacing={3}
          sx={{ transition: "0.3s" }}
        >
          <MyServices status={"inactive"} />
        </Grid>
      </ContainerGrid>
    </Page>
  )
}
