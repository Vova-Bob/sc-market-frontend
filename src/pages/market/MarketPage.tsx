import React, { useEffect, useMemo, useState } from "react"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import {
  Container,
  Divider,
  Grid,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material"
import {
  BulkListingsRefactor,
  BuyOrders,
} from "../../views/market/ItemListings"
import {
  ContainerGrid,
  OpenLayout,
} from "../../components/layout/ContainerGrid"
import { sidebarDrawerWidth, useDrawerOpen } from "../../hooks/layout/Drawer"
import CloseIcon from "@mui/icons-material/CloseRounded"
import MenuIcon from "@mui/icons-material/MenuRounded"
import { useTheme } from "@mui/material/styles"
import { ExtendedTheme } from "../../hooks/styles/Theme"
import { MarketSidebarContext } from "../../hooks/market/MarketSidebar"
import { Page } from "../../components/metadata/Page"
import {
  BuyOrderActions,
  MarketActions,
} from "../../components/button/MarketActions"
import {
  HideOnScroll,
  MarketNavArea,
} from "../../components/navbar/MarketNavArea"
import { useMarketSearch } from "../../hooks/market/MarketSearch"
import { Link, useLocation } from "react-router-dom"
import { a11yProps, TabPanel } from "../../components/tabs/Tabs"
import { ItemMarketView } from "../../views/market/ItemMarketView"
import { ServiceMarketView } from "../../views/services/ServiceMarketView"
import { ServiceActions } from "../../views/services/ServiceActions"
import { Stack } from "@mui/system"
import { useTranslation } from "react-i18next"

export function MarketPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const pages = ["/market/services", "/market"]
  const tabPage = useMemo(
    () =>
      pages.indexOf(
        pages.find((p) => location.pathname.startsWith(p)) || "/market",
      ),
    [location.pathname],
  )

  return (
    <Page title={t("market.market")} dontUseDefaultCanonUrl={true}>
      <OpenLayout sidebarOpen={true}>
        <Container maxWidth={"lg"} sx={{ paddingTop: 8 }}>
          <Grid
            container
            spacing={2}
            justifyContent={"space-between"}
            sx={{ marginBottom: 4 }}
          >
            <Grid item>
              <Stack direction={"row"} spacing={2}>
                <Typography
                  variant={"h4"}
                  sx={{ fontWeight: "bold" }}
                  color={"text.secondary"}
                >
                  {t("market.market")}
                </Typography>
                <Tabs
                  value={tabPage}
                  aria-label={t("ui.aria.orgInfoArea")}
                  variant="scrollable"
                  textColor="secondary"
                  indicatorColor="secondary"
                >
                  <Tab
                    label={t("market.itemsTab")}
                    value={1}
                    component={Link}
                    {...a11yProps(0)}
                    to={"/market"}
                  />
                  <Tab
                    label={t("market.servicesTab")}
                    value={0}
                    component={Link}
                    {...a11yProps(1)}
                    to={"/market/services"}
                  />
                </Tabs>
              </Stack>
            </Grid>
            {tabPage === 1 ? <MarketActions /> : <ServiceActions />}
          </Grid>
        </Container>

        <TabPanel value={tabPage} index={1}>
          <ItemMarketView />
        </TabPanel>
        <TabPanel value={tabPage} index={0}>
          <ServiceMarketView />
        </TabPanel>
      </OpenLayout>
    </Page>
  )
}

export function BulkItems() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [drawerOpen] = useDrawerOpen()
  const theme = useTheme<ExtendedTheme>()

  const [marketSearch, setMarketSearch] = useMarketSearch()
  useEffect(() => {
    setMarketSearch({
      ...marketSearch,
      quantityAvailable: marketSearch.quantityAvailable || 1,
      sort: marketSearch.sort || "activity",
    })
  }, [])

  return (
    <Page title={t("market.bulkItems")}>
      <IconButton
        color="secondary"
        aria-label={t("toggle_market_sidebar")}
        sx={{
          position: "absolute",
          zIndex: 50,
          [theme.breakpoints.up("sm")]: {
            left: (drawerOpen ? sidebarDrawerWidth : 0) + 16,
          },
          [theme.breakpoints.down("sm")]: {
            left: (drawerOpen ? sidebarDrawerWidth : 0) + 16,
          },
          [theme.breakpoints.up("md")]: {
            display: "none",
          },
          top: 64 + 24,
        }}
        onClick={() => {
          setOpen(true)
        }}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
      <MarketSidebarContext.Provider value={[open, setOpen]}>
        {/*<MarketSidebar/>*/}
        <ContainerGrid maxWidth={"lg"} sidebarOpen={true}>
          <Grid item xs={12}>
            <Grid container justifyContent={"space-between"} spacing={1}>
              <HeaderTitle lg={7} xl={7}>
                {t("market.bulkListings")}
              </HeaderTitle>

              <MarketActions />

              <Grid item xs={12}>
                <HideOnScroll>
                  <MarketNavArea />
                </HideOnScroll>
              </Grid>

              <Grid item xs={12}>
                <Divider light />
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            container
            xs={12}
            lg={12}
            spacing={1.5}
            sx={{ transition: "0.3s" }}
          >
            <BulkListingsRefactor />
          </Grid>
        </ContainerGrid>
      </MarketSidebarContext.Provider>
    </Page>
  )
}

export function BuyOrderItems() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [drawerOpen] = useDrawerOpen()
  const theme = useTheme<ExtendedTheme>()

  const [marketSearch, setMarketSearch] = useMarketSearch()
  useEffect(() => {
    setMarketSearch({
      ...marketSearch,
      quantityAvailable: 0,
      sort: marketSearch.sort || "activity",
    })
  }, [])

  return (
    <Page title={t("market.bulkItems")}>
      <IconButton
        color="secondary"
        aria-label={t("toggle_market_sidebar")}
        sx={{
          position: "absolute",
          zIndex: 50,
          [theme.breakpoints.up("sm")]: {
            left: (drawerOpen ? sidebarDrawerWidth : 0) + 16,
          },
          [theme.breakpoints.down("sm")]: {
            left: (drawerOpen ? sidebarDrawerWidth : 0) + 16,
          },
          [theme.breakpoints.up("md")]: {
            display: "none",
          },
          top: 64 + 24,
        }}
        onClick={() => {
          setOpen(true)
        }}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
      <MarketSidebarContext.Provider value={[open, setOpen]}>
        {/*<MarketSidebar/>*/}
        <ContainerGrid maxWidth={"lg"} sidebarOpen={true}>
          <Grid item xs={12}>
            <Grid container justifyContent={"space-between"} spacing={1}>
              <HeaderTitle lg={7} xl={7}>
                {t("market.buyOrders")}
              </HeaderTitle>

              <BuyOrderActions />

              <Grid item xs={12}>
                <HideOnScroll>
                  <MarketNavArea />
                </HideOnScroll>
              </Grid>

              <Grid item xs={12}>
                <Divider light />
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            container
            xs={12}
            lg={12}
            spacing={1.5}
            sx={{ transition: "0.3s" }}
          >
            <BuyOrders />
          </Grid>
        </ContainerGrid>
      </MarketSidebarContext.Provider>
    </Page>
  )
}
