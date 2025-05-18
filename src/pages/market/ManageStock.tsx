import React, { useEffect, useState } from "react"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { Grid, Paper } from "@mui/material"
import { MarketSearchArea } from "../../views/market/MarketSidebar"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { MarketSidebarContext } from "../../hooks/market/MarketSidebar"
import { Page } from "../../components/metadata/Page"
import { ManageListingsActions } from "../../components/button/MarketActions"
import { MyItemStock } from "../../views/market/ItemStockDataGrid"
import { ItemStockContext } from "../../views/market/ItemStock"
import { useMarketSearch } from "../../hooks/market/MarketSearch"
import { BaseListingType } from "../../datatypes/MarketListing"

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
            <Grid item xs={12} md={3}>
              <Paper>
                <MarketSearchArea status />
              </Paper>
            </Grid>

            <Grid item xs={12} md={9}>
              <Grid container spacing={1}>
                <HeaderTitle lg={7} xl={7}>
                  Manage Stock
                </HeaderTitle>

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
