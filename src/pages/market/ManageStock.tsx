import React, { useEffect, useState } from "react"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { Divider, Grid, IconButton, useTheme } from "@mui/material"
import { MarketSidebar } from "../../views/market/MarketSidebar"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { sidebarDrawerWidth, useDrawerOpen } from "../../hooks/layout/Drawer"
import CloseIcon from "@mui/icons-material/CloseRounded"
import MenuIcon from "@mui/icons-material/MenuRounded"
import { MarketSidebarContext } from "../../hooks/market/MarketSidebar"
import { Page } from "../../components/metadata/Page"
import { ManageListingsActions } from "../../components/button/MarketActions"
import { MyItemStock } from "../../views/market/ItemStockDataGrid"
import { ItemStockContext } from "../../views/market/ItemStock"
import { useMarketSearch } from "../../hooks/market/MarketSearch"
import { BaseListingType } from "../../datatypes/MarketListing"
import { ExtendedTheme } from "../../hooks/styles/Theme"

export function ManageStock() {
  const [open, setOpen] = useState(true)
  const [drawerOpen] = useDrawerOpen()
  const [searchState, setSearchState] = useMarketSearch()
  const theme = useTheme<ExtendedTheme>()

  useEffect(() => {
    setSearchState({
      query: "",
      quantityAvailable: 0,
      sort: searchState.sort || "activity",
    })
  }, [])

  const [selectedListings, setSelectedListings] = useState<BaseListingType[]>(
    [],
  )

  return (
    <Page title={"My Market Listings"}>
      <IconButton
        color="secondary"
        aria-label="toggle market sidebar"
        sx={{
          zIndex: theme.zIndex.drawer - 2,
          position: "absolute",
          left: (drawerOpen ? sidebarDrawerWidth : 0) + 24,
          top: 64 + 24,
        }}
        onClick={() => {
          setOpen((value) => !value)
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
              <Grid item xs={12}>
                <MyItemStock />
              </Grid>
            </Grid>
          </ContainerGrid>
        </MarketSidebarContext.Provider>
      </ItemStockContext.Provider>
    </Page>
  )
}
