import React, { useEffect, useState } from "react"
import { Grid, Paper } from "@mui/material"
import { MarketSearchArea } from "../../views/market/MarketSidebar"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { MarketSidebarContext } from "../../hooks/market/MarketSidebar"
import { Page } from "../../components/metadata/Page"
import { MyItemStock } from "../../views/market/ItemStockDataGrid"
import { ItemStockContext } from "../../views/market/ItemStock"
import { useMarketSearch } from "../../hooks/market/MarketSearch"
import { BaseListingType } from "../../datatypes/MarketListing"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { ManageListingsActions } from "../../components/button/MarketActions"

export function ManageStock() {
  const [open, setOpen] = useState(true)
  const [searchState, setSearchState] = useMarketSearch()

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
      <ItemStockContext.Provider
        value={[selectedListings, setSelectedListings]}
      >
        <MarketSidebarContext.Provider value={[open, setOpen]}>
          <ContainerGrid maxWidth={"xl"} sidebarOpen={true}>
            <HeaderTitle>Manage Listings</HeaderTitle>

            <Grid item xs={12} md={3}>
              <Paper>
                <MarketSearchArea status />
              </Paper>
            </Grid>

            <Grid item xs={12} md={9}>
              <Grid container>
                <ManageListingsActions />
                <Grid item xs={12}>
                  <MyItemStock />
                </Grid>
              </Grid>
            </Grid>
          </ContainerGrid>
        </MarketSidebarContext.Provider>
      </ItemStockContext.Provider>
    </Page>
  )
}
