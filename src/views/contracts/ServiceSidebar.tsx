import {
  Box,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import SearchIcon from "@mui/icons-material/Search"
import CloseIcon from "@mui/icons-material/Close"
import React, { useEffect, useState } from "react"

import { ExtendedTheme } from "../../hooks/styles/Theme"
import { sidebarDrawerWidth, useDrawerOpen } from "../../hooks/layout/Drawer"
import { marketDrawerWidth } from "../../hooks/market/MarketSidebar"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import { useServiceSidebar } from "../../hooks/contract/ServiceSidebar"
import { useServiceSearch } from "../../hooks/contract/ServiceSearch"
import { orderIcons } from "../../datatypes/Order"

export function ServiceSidebar() {
  const theme: ExtendedTheme = useTheme()

  // Search fields
  const [kind, setKind] = useState<string>("Any")
  const [minOffer, setMinOffer] = useState<number>(0)
  const [maxOffer, setMaxOffer] = useState<number | null>(null)
  const [query, setQuery] = useState<string>("")
  const [paymentType, setPaymentType] = useState<string>("any")

  // States
  const [open, setOpen] = useServiceSidebar()
  const [, setSearchState] = useServiceSearch()
  const [drawerOpen] = useDrawerOpen()

  const xs = useMediaQuery(theme.breakpoints.down("lg"))
  useEffect(() => {
    setOpen(!xs)
  }, [setOpen, xs])

  const handleKindChange = (event: { target: { value: string } }) => {
    setKind(event.target.value)
  }
  const handleMinCostChange = (event: { target: { value: string } }) => {
    setMinOffer(+event.target.value || 0)
  }
  const handleMaxCostChange = (event: { target: { value: string } }) => {
    setMaxOffer(event.target.value ? +event.target.value || null : null)
  }
  const handleQueryChange = (event: { target: { value: string } }) => {
    setQuery(event.target.value)
  }

  const handlePaymentTypeChange = (event: { target: { value: string } }) => {
    setPaymentType(event.target.value)
  }

  useEffect(() => {
    setSearchState((state) => ({
      ...state,
      kind: kind === "Any" ? undefined : kind,
      minOffer: minOffer,
      maxOffer: maxOffer,
      query: query,
      paymentType: paymentType === "any" ? undefined : paymentType,
    }))
  }, [kind, setSearchState, query, minOffer, maxOffer, paymentType])

  return (
    <Drawer
      variant="permanent"
      open
      sx={{
        zIndex: theme.zIndex.drawer - 3,
        width: open ? marketDrawerWidth : 0,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        "& .MuiDrawer-paper": {
          width: open ? marketDrawerWidth : 0,
          boxSizing: "border-box",
          overflow: "scroll",
          [theme.breakpoints.up("sm")]: {
            left: drawerOpen ? sidebarDrawerWidth : 0,
          },
          [theme.breakpoints.down("sm")]: {
            left: 0,
          },
          backgroundColor: theme.palette.background.default,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.easeOut,
            duration: "0.3s",
          }),
          borderColor: theme.palette.outline.main,
        },
        position: "relative",
        whiteSpace: "nowrap",
        // backgroundColor: "#132321",
        // backgroundRepeat: 'no-repeat',
        // backgroundPosition: 'center',
        // backgroundSize: "cover",
        background: "transparent",
        overflow: "scroll",
        borderColor: theme.palette.outline.main,
      }}
      container={
        window !== undefined
          ? () => window.document.getElementById("rootarea")
          : undefined
      }
    >
      <Box
        sx={{
          ...theme.mixins.toolbar,
          position: "relative",
          width: "100%",
        }}
      />
      <Box
        sx={{
          width: "100%",
          height: "100%",
          flexDirection: "column",
          display: "flex",
          padding: theme.spacing(3),
          paddingTop: theme.spacing(3),
          borderColor: theme.palette.outline.main,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <IconButton onClick={() => setOpen(false)} color={"secondary"}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={"Search"}
              InputProps={{
                startAdornment: <SearchIcon style={{ color: "inherit" }} />,
              }}
              value={query}
              onChange={handleQueryChange}
              color={"secondary"}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant={"subtitle2"} fontWeight={"bold"}>
              Filtering
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              value={kind}
              label="Contract Type"
              onChange={handleKindChange}
              color={"secondary"}
              SelectProps={{
                IconComponent: KeyboardArrowDownRoundedIcon,
              }}
            >
              {["Any", ...Object.keys(orderIcons)].map((k) => (
                <MenuItem value={k} key={k}>
                  {k}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={"subtitle2"} fontWeight={"bold"}>
              Cost
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              value={minOffer}
              label="Minimum Cost"
              onChange={handleMinCostChange}
              color={"secondary"}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">{`aUEC`}</InputAdornment>
                ),
                inputMode: "numeric",
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              value={maxOffer == null ? "" : maxOffer}
              label="Maximum Cost"
              onChange={handleMaxCostChange}
              color={"secondary"}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">{`aUEC`}</InputAdornment>
                ),
                inputMode: "numeric",
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label={"Payment Type"}
              value={paymentType}
              onChange={handlePaymentTypeChange}
              fullWidth
              SelectProps={{
                IconComponent: KeyboardArrowDownRoundedIcon,
              }}
            >
              <MenuItem value={"any"}>Any</MenuItem>
              <MenuItem value={"one-time"}>One time</MenuItem>
              <MenuItem value={"hourly"}>Hourly</MenuItem>
              <MenuItem value={"daily"}>Daily</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  )
}
