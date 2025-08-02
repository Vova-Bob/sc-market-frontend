import React, { useState } from "react"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { sidebarDrawerWidth, useDrawerOpen } from "../../hooks/layout/Drawer"
import CloseIcon from "@mui/icons-material/CloseRounded"
import MenuIcon from "@mui/icons-material/MenuRounded"
import { Button, Grid, IconButton } from "@mui/material"
import { Page } from "../../components/metadata/Page"
import { ServiceSidebar } from "../../views/contracts/ServiceSidebar"
import { ServiceSidebarContext } from "../../hooks/contract/ServiceSidebar"
import { ServiceListings } from "../../views/contracts/ServiceListings"
import { Link } from "react-router-dom"
import { CreateRounded } from "@mui/icons-material"

export function Services() {
  const [open, setOpen] = useState(true)

  const [drawerOpen] = useDrawerOpen()

  return (
    <Page title={"Contracts"}>
      <ServiceSidebarContext.Provider value={[open, setOpen]}>
        <IconButton
          color="secondary"
          aria-label="toggle service sidebar"
          sx={{
            position: "absolute",
            zIndex: 50,
            left: (drawerOpen ? sidebarDrawerWidth : 0) + 24,
            top: 64 + 24,
            transition: "0.3s",
          }}
          onClick={() => {
            setOpen(true)
          }}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        <ServiceSidebar />
        <ContainerGrid maxWidth={"lg"} sidebarOpen={true}>
          <Grid
            item
            container
            justifyContent={"space-between"}
            spacing={2}
            xs={12}
          >
            <HeaderTitle md={7} lg={7} xl={7}>
              Contractor Services
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
          <ServiceListings />
        </ContainerGrid>
      </ServiceSidebarContext.Provider>
    </Page>
  )
}
