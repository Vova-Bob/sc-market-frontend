import { MarketSidebar } from "./MarketSidebar"
import {
  Container,
  Divider,
  Grid,
  IconButton,
  useMediaQuery,
} from "@mui/material"
import {
  HideOnScroll,
  MarketNavArea,
} from "../../components/navbar/MarketNavArea"
import { ItemListings } from "./ItemListings"
import { MarketSidebarContext } from "../../hooks/market/MarketSidebar"
import React, { useState } from "react"
import { useTheme } from "@mui/material/styles"
import { useDrawerOpen } from "../../hooks/layout/Drawer"
import CloseIcon from "@mui/icons-material/CloseRounded"
import MenuIcon from "@mui/icons-material/MenuRounded"

export function ItemMarketView() {
  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.down("md"))
  const drawerOpen = useDrawerOpen()
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButton
        color="secondary"
        aria-label="toggle market sidebar"
        sx={{
          position: "absolute",
          zIndex: 50,
          left: 16,
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
        {xs && <MarketSidebar />}

        <Container maxWidth={"lg"}>
          <Grid container spacing={2} justifyContent={"center"}>
            <Grid item xs={12}>
              <HideOnScroll>
                <MarketNavArea />
              </HideOnScroll>
            </Grid>

            <Grid item xs={12}>
              <Divider light />
            </Grid>

            <Grid
              item
              container
              xs={12}
              lg={12}
              spacing={1.5}
              sx={{ transition: "0.3s" }}
            >
              <ItemListings />
            </Grid>
          </Grid>
        </Container>
      </MarketSidebarContext.Provider>
    </>
  )
}
