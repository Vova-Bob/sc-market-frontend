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
import React, { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ExtendedTheme } from "../../hooks/styles/Theme"
import { sidebarDrawerWidth, useDrawerOpen } from "../../hooks/layout/Drawer"
import {
  marketDrawerWidth,
  useMarketSidebar,
} from "../../hooks/market/MarketSidebar"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import { useSearchParams } from "react-router-dom"
import { SearchRounded } from "@mui/icons-material"
import { useMarketSearch } from "../../hooks/market/MarketSearch"
import { SelectGameCategoryOption } from "../../components/select/SelectGameItem"
import CloseIcon from "@mui/icons-material/CloseRounded"
import MenuIcon from "@mui/icons-material/MenuRounded"

export function MarketSearchArea(props: { status?: boolean }) {
  const theme: ExtendedTheme = useTheme()
  const { t } = useTranslation()
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
    <Box
      sx={{
        width: "100%",
        height: "100%",
        flexDirection: "column",
        display: "flex",
        padding: theme.spacing(2),
        borderColor: theme.palette.outline.main,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            onClick={searchClickCallback}
            startIcon={<SearchRounded />}
            variant={"contained"}
          >
            {t("MarketSearchArea.searchBtn")}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t("MarketSearchArea.search")}
            size={"small"}
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
            {t("MarketSearchArea.sorting")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            size={"small"}
            label={t("MarketSearchArea.sortAttribute")}
            value={sort || ""}
            onChange={handleSortChange}
            color={"secondary"}
            SelectProps={{
              IconComponent: KeyboardArrowDownRoundedIcon,
            }}
          >
            <MenuItem value={""}>{t("MarketSearchArea.none")}</MenuItem>
            <MenuItem value={"title"}>{t("MarketSearchArea.title")}</MenuItem>
            <MenuItem value={"price-low"}>
              {t("MarketSearchArea.priceLowHigh")}
            </MenuItem>
            <MenuItem value={"price-high"}>
              {t("MarketSearchArea.priceHighLow")}
            </MenuItem>
            <MenuItem value={"quantity-low"}>
              {t("MarketSearchArea.quantityLowHigh")}
            </MenuItem>
            <MenuItem value={"quantity-high"}>
              {t("MarketSearchArea.quantityHighLow")}
            </MenuItem>
            <MenuItem value={"date-new"}>
              {t("MarketSearchArea.dateOldNew")}
            </MenuItem>
            <MenuItem value={"date-old"}>
              {t("MarketSearchArea.dateNewOld")}
            </MenuItem>
            <MenuItem value={"activity"}>
              {t("MarketSearchArea.activity")}
            </MenuItem>
            <MenuItem value={"rating"}>{t("MarketSearchArea.rating")}</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Typography variant={"subtitle2"} fontWeight={"bold"}>
            {t("MarketSearchArea.filtering")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t("MarketSearchArea.quantityAvailable")}
            color={"secondary"}
            size={"small"}
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
        {props.status && (
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              value={activity || ""}
              onChange={handleActivityChange}
              label={t("MarketSearchArea.listingStatus")}
              size={"small"}
              color={"secondary"}
              SelectProps={{
                IconComponent: KeyboardArrowDownRoundedIcon,
              }}
            >
              <MenuItem value={""}>{t("MarketSearchArea.either")}</MenuItem>
              <MenuItem value={"active"}>
                {t("MarketSearchArea.active")}
              </MenuItem>
              <MenuItem value={"inactive"}>
                {t("MarketSearchArea.inactive")}
              </MenuItem>
            </TextField>
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            value={kind}
            onChange={handleKindChange}
            label={t("MarketSearchArea.saleType")}
            color={"secondary"}
            size={"small"}
            SelectProps={{
              IconComponent: KeyboardArrowDownRoundedIcon,
            }}
          >
            <MenuItem value={"any"}>{t("MarketSearchArea.any")}</MenuItem>
            <MenuItem value={"sale"}>{t("MarketSearchArea.sale")}</MenuItem>
            <MenuItem value={"aggregate"}>
              {t("MarketSearchArea.commodity")}
            </MenuItem>
            <MenuItem value={"auction"}>
              {t("MarketSearchArea.auction")}
            </MenuItem>
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
            {t("MarketSearchArea.cost")}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t("MarketSearchArea.minCost")}
            onChange={handleMinCostChange}
            value={minCost}
            size={"small"}
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
            label={t("MarketSearchArea.maxCost")}
            size={"small"}
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
  )
}

export function MarketSidebar(props: { status?: boolean }) {
  const { status } = props

  const [drawerOpen] = useDrawerOpen()
  const [open, setOpen] = useMarketSidebar()
  const theme = useTheme<ExtendedTheme>()

  // const xs = useMediaQuery(theme.breakpoints.down('lg'));
  // useEffect(() => {
  //     setOpen(!xs)
  // }, [setOpen, xs])

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

      <MarketSearchArea status={status} />
    </Drawer>
  )
}

export function MarketSideBarToggleButton() {
  const [open, setOpen] = useMarketSidebar()
  const theme = useTheme<ExtendedTheme>()
  const [drawerOpen] = useDrawerOpen()
  const { t } = useTranslation()

  return (
    <IconButton
      color="secondary"
      aria-label={t("market.toggleSidebar")}
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
  )
}
