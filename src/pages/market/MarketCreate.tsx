import React, { useMemo } from "react"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import {
  AggregateMarketListingForm,
  MarketListingForm,
  MarketMultipleForm,
} from "../../views/market/MarketListingForm"
import { Page } from "../../components/metadata/Page"
import { Grid, Tab, Tabs } from "@mui/material"
import { Link } from "react-router-dom"
import { a11yProps, TabPanel } from "../../components/tabs/Tabs"
import { useParams } from "react-router-dom"
import { BackArrow } from "../../components/button/BackArrow"

const name_to_index = new Map([
  // ["aggregate", 0],
  ["unique", 0],
  ["auction", 1],
  ["combined", 2],
])

export function MarketCreate(props: {}) {
  const { tab } = useParams<{ tab?: string }>()
  const page = useMemo(() => name_to_index.get(tab || "aggregate") || 0, [tab])

  return (
    <Page title={"Create Market Listing"}>
      <ContainerGrid maxWidth={"lg"} sidebarOpen={true}>
        <HeaderTitle lg={12} xl={12}>
          <BackArrow /> Create Market Listing
        </HeaderTitle>

        <Grid item xs={12}>
          <Tabs
            value={page}
            // onChange={handleChange}
            aria-label="market listing tabs"
            variant="scrollable"
            textColor="secondary"
            indicatorColor="secondary"
          >
            {/*<Tab*/}
            {/*  label="Bulk Listing"*/}
            {/*  component={Link}*/}
            {/*  to={`/market/create/aggregate`}*/}
            {/*  // icon={*/}
            {/*  //     <DesignServicesRounded/>*/}
            {/*  // }*/}
            {/*  {...a11yProps(0)}*/}
            {/*/>*/}
            <Tab
              component={Link}
              to={`/market/create/unique`}
              label="Unique Listing"
              // icon={
              //     <InfoRounded/>
              // }
              {...a11yProps(0)}
            />
            <Tab
              component={Link}
              to={`/market/create/auction`}
              label="Auction"
              // icon={
              //     <InfoRounded/>
              // }
              {...a11yProps(1)}
            />
            <Tab
              component={Link}
              to={`/market/create/combined`}
              label="Combined Listing"
              // icon={
              //     <InfoRounded/>
              // }
              {...a11yProps(2)}
            />
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          {/*<TabPanel value={page} index={0}>*/}
          {/*  <Grid container spacing={4}>*/}
          {/*    <AggregateMarketListingForm />*/}
          {/*  </Grid>*/}
          {/*</TabPanel>*/}
          <TabPanel value={page} index={0}>
            <Grid container spacing={4}>
              <MarketListingForm sale_type={"sale"} key={"sale"} />
            </Grid>
          </TabPanel>
          <TabPanel value={page} index={1}>
            <Grid container spacing={4}>
              <MarketListingForm sale_type={"auction"} key={"auction"} />
            </Grid>
          </TabPanel>
          <TabPanel value={page} index={2}>
            <Grid container spacing={4}>
              <MarketMultipleForm />
            </Grid>
          </TabPanel>
        </Grid>
      </ContainerGrid>
    </Page>
  )
}
