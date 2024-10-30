import React, { useEffect, useState } from "react"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { Divider, Grid, IconButton } from "@mui/material"
import { MarketSidebar } from "../../views/market/MarketSidebar"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { sidebarDrawerWidth, useDrawerOpen } from "../../hooks/layout/Drawer"
import CloseIcon from "@mui/icons-material/CloseRounded"
import MenuIcon from "@mui/icons-material/MenuRounded"
import { MarketSidebarContext } from "../../hooks/market/MarketSidebar"
import { Page } from "../../components/metadata/Page"
import { ManageListingsActions } from "../../components/button/MarketActions"
import { ItemStockContext, MyItemStock } from "../../views/market/ItemStock"
import { useMarketSearch } from "../../hooks/market/MarketSearch"

export function ManageStock(props: {}) {
  const [open, setOpen] = useState(true)
  const [drawerOpen] = useDrawerOpen()
  const [searchState, setSearchState] = useMarketSearch()

  useEffect(() => {
    setSearchState({
      query: "",
      quantityAvailable: 0,
      sort: searchState.sort || "activity",
    })
  }, [])

  const [selectedListings, setSelectedListings] = useState<string[]>([])

  return (
    <Page title={"My Market Listings"}>
      <IconButton
        color="secondary"
        aria-label="toggle market sidebar"
        sx={{
          position: "absolute",
          zIndex: 50,
          left: (drawerOpen ? sidebarDrawerWidth : 0) + 24,
          top: 64 + 24,
        }}
        onClick={() => {
          setOpen(true)
        }}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
      <ItemStockContext.Provider
        value={[selectedListings, setSelectedListings]}
      >
        <MarketSidebarContext.Provider value={[open, setOpen]}>
          <MarketSidebar status />
          <ContainerGrid maxWidth={"lg"} sidebarOpen={true}>
            <Grid
              item
              container
              justifyContent={"space-between"}
              spacing={2}
              xs={12}
            >
              <HeaderTitle lg={7} xl={7}>
                Manage Stock
              </HeaderTitle>

              <ManageListingsActions />
            </Grid>

            <Grid
              item
              container
              xs={12}
              lg={12}
              spacing={3}
              sx={{ transition: "0.3s" }}
            >
              <Divider light />
              <MyItemStock />
            </Grid>
          </ContainerGrid>
        </MarketSidebarContext.Provider>
      </ItemStockContext.Provider>
    </Page>
  )
}
