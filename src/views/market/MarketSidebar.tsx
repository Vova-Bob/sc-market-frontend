import {
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import SearchIcon from "@mui/icons-material/Search"
import CloseIcon from "@mui/icons-material/Close"
import React, { useCallback, useEffect, useState } from "react"

import { ExtendedTheme } from "../../hooks/styles/Theme"
import { sidebarDrawerWidth, useDrawerOpen } from "../../hooks/layout/Drawer"
import {
  marketDrawerWidth,
  useMarketSidebar,
} from "../../hooks/market/MarketSidebar"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import { item_types, ItemType } from "../../datatypes/MarketListing"
import { useSearchParams } from "react-router-dom"
import { SearchRounded } from "@mui/icons-material"
import { useMarketSearch } from "../../hooks/market/MarketSearch"
import { SelectGameCategoryOption } from "../../components/select/SelectGameItem"

export function MarketSidebar(props: { status?: boolean }) {
  const { status } = props
  const theme: ExtendedTheme = useTheme()

  const [searchParams, setSearchParams] = useSearchParams()

  const [searchState, setMarketSearch] = useMarketSearch()
  const [sort, setSort] = useState<string | null>(searchState.sort || null)
  const [kind, setKind] = useState<string>(searchState.sale_type || "any")
  const [type, setType] = useState<string | null>(null)
  const [quantityAvailable, setQuantityAvailable] = useState<number>(
    searchState.quantityAvailable !== undefined
      ? searchState.quantityAvailable
      : 1,
  )
  const [minCost, setMinCost] = useState<number>(searchState.minCost || 0)
  const [maxCost, setMaxCost] = useState<number | null>(
    searchState.maxCost || null,
  )
  const [query, setQuery] = useState<string>(searchState.query || "")
  const [activity, setActivity] = useState<string>(
    searchState.status ? "active" : "",
  )
  const [drawerOpen] = useDrawerOpen()
  const [open, setOpen] = useMarketSidebar()

  // const xs = useMediaQuery(theme.breakpoints.down('lg'));
  // useEffect(() => {
  //     setOpen(!xs)
  // }, [setOpen, xs])

  const handleKindChange = (event: { target: { value: string } }) => {
    setKind(event.target.value)
  }
  const handleSortChange = (event: { target: { value: string } }) => {
    setSort(event.target.value || null)
  }
  const handleTypeChange = (value: string | null) => {
    setType(value)
  }
  const handleQuantityChange = (event: { target: { value: string } }) => {
    setQuantityAvailable(+event.target.value || 0)
  }
  const handleMinCostChange = (event: { target: { value: string } }) => {
    setMinCost(+event.target.value || 0)
  }
  const handleMaxCostChange = (event: { target: { value: string } }) => {
    setMaxCost(event.target.value ? +event.target.value || null : null)
  }
  const handleQueryChange = (event: { target: { value: string } }) => {
    setQuery(event.target.value)
  }
  const handleActivityChange = (event: { target: { value: string } }) => {
    setActivity(event.target.value)
  }

  const searchClickCallback = useCallback(() => {
    setMarketSearch({
      sale_type: kind,
      item_type: type || undefined,
      quantityAvailable,
      minCost,
      maxCost,
      query,
      sort,
      status: activity,
    })
  }, [
    activity,
    kind,
    maxCost,
    minCost,
    quantityAvailable,
    query,
    setMarketSearch,
    sort,
    type,
  ])

  useEffect(() => {
    setType(searchParams.get("type") || "any")
  }, [searchParams])

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
          // backgroundColor: theme.palette.background.default,
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
          <Grid item>
            <IconButton onClick={() => setOpen(false)} color={"secondary"}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <Button
              onClick={searchClickCallback}
              startIcon={<SearchRounded />}
              variant={"contained"}
            >
              Search
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={"Search"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={query}
              onChange={handleQueryChange}
              color={"secondary"}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant={"subtitle2"} fontWeight={"bold"}>
              Sorting
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Sort Attribute"
              value={sort || ""}
              onChange={handleSortChange}
              color={"secondary"}
              SelectProps={{
                IconComponent: KeyboardArrowDownRoundedIcon,
              }}
            >
              <MenuItem value={""}>None</MenuItem>
              <MenuItem value={"title"}>Title</MenuItem>
              <MenuItem value={"price-low"}>Price (Low to High)</MenuItem>
              <MenuItem value={"price-high"}>Price (High to Low)</MenuItem>
              <MenuItem value={"quantity-low"}>
                Quantity Available (Low to High)
              </MenuItem>
              <MenuItem value={"quantity-high"}>
                Quantity Available (High to Low)
              </MenuItem>
              <MenuItem value={"date-new"}>Date Listed (Old to New)</MenuItem>
              <MenuItem value={"date-old"}>Date Listed (New to Old)</MenuItem>
              <MenuItem value={"activity"}>Recent Activity</MenuItem>
              <MenuItem value={"rating"}>Rating (High to Low)</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={"subtitle2"} fontWeight={"bold"}>
              Filtering
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Quantity Available"
              color={"secondary"}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              InputProps={{
                // endAdornment: <InputAdornment
                //     position="start">
                //     {`of ${listing.quantity_available} available`}
                // </InputAdornment>,
                inputMode: "numeric",
              }}
              onChange={handleQuantityChange}
            />
          </Grid>
          {status && (
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                value={activity || ""}
                onChange={handleActivityChange}
                label="Listing Status"
                color={"secondary"}
                SelectProps={{
                  IconComponent: KeyboardArrowDownRoundedIcon,
                }}
              >
                <MenuItem value={""}>Either</MenuItem>
                <MenuItem value={"active"}>Active</MenuItem>
                <MenuItem value={"inactive"}>Inactive</MenuItem>
              </TextField>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              value={kind}
              onChange={handleKindChange}
              label="Sale Type"
              color={"secondary"}
              SelectProps={{
                IconComponent: KeyboardArrowDownRoundedIcon,
              }}
            >
              <MenuItem value={"any"}>Any</MenuItem>
              <MenuItem value={"sale"}>Sale</MenuItem>
              <MenuItem value={"aggregate"}>Commodity</MenuItem>
              <MenuItem value={"auction"}>Auction</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <SelectGameCategoryOption
              item_type={type}
              onTypeChange={handleTypeChange}
              TextfieldProps={{
                size: "small",
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant={"subtitle2"} fontWeight={"bold"}>
              Cost
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Minimum Cost"
              onChange={handleMinCostChange}
              value={minCost}
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
              value={maxCost == null ? "" : maxCost}
              onChange={handleMaxCostChange}
              label="Maximum Cost"
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
        </Grid>
      </Box>
    </Drawer>
  )
}
