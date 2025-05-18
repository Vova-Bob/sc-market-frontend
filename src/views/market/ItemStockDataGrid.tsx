import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid"
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Link as MaterialLink,
  TextField,
  Typography,
} from "@mui/material"
import {
  AddRounded,
  CreateRounded,
  RadioButtonCheckedRounded,
  RefreshOutlined,
  RemoveRounded,
} from "@mui/icons-material"
import { ItemStockContext, StockRow } from "./ItemStock"
import { useMarketSearch } from "../../hooks/market/MarketSearch"
import { filterListings } from "./ItemListings"
import { formatMarketUrl } from "../../util/urls"
import { Link } from "react-router-dom"
import { BaseListingType } from "../../datatypes/MarketListing"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import {
  useMarketGetMyListingsQuery,
  useMarketRefreshListingMutation,
  useMarketUpdateListingQuantityMutation,
} from "../../store/market"
import { Stack } from "@mui/system"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { NumericFormat } from "react-number-format"
import { RefreshCircle } from "mdi-material-ui"
import { formatMostSignificantDiff } from "../../util/time"

export function ManageStockArea(props: { listings: BaseListingType[] }) {
  const [quantity, setQuantity] = useState(1)
  const { listings } = props

  const [updateListing] = useMarketUpdateListingQuantityMutation()

  const issueAlert = useAlertHook()

  const updateListingCallback = useCallback(
    async (listing: BaseListingType, body: { quantity_available: number }) => {
      console.log(listing, body)
      updateListing({
        listing_id: listing.listing.listing_id,
        body,
      })
        .unwrap()
        .then(() =>
          issueAlert({
            message: "Updated!",
            severity: "success",
          }),
        )
        .catch((err) => issueAlert(err))
    },
    [listings, issueAlert, updateListing],
  )

  return (
    <Box
      sx={{
        paddingBottom: 2,
        paddingTop: 2,
        display: "flex",
        "& > *": { marginRight: 2 },
        paddingRight: 2,
        // justifyContent: 'space-between'
      }}
    >
      <NumericFormat
        decimalScale={0}
        allowNegative={false}
        customInput={TextField}
        thousandSeparator
        onValueChange={async (values) => {
          setQuantity(values.floatValue || 0)
        }}
        inputProps={{
          inputMode: "numeric",
          pattern: "[0-9]*",
          type: "numeric",
          size: "small",
        }}
        sx={{
          marginRight: 2,
          minWidth: 200,
        }}
        fullWidth
        size="small"
        label={"Update Amount"}
        value={quantity}
        color={"secondary"}
      />

      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
      >
        <Button
          size={"small"}
          onClick={() =>
            listings.map((listing) =>
              updateListingCallback(listing, {
                quantity_available:
                  listing.listing.quantity_available + quantity,
              }),
            )
          }
          color={"success"}
        >
          <AddRounded />
        </Button>
        <Button
          size={"small"}
          onClick={() =>
            listings.map((listing) =>
              updateListingCallback(listing, { quantity_available: 0 }),
            )
          }
          color={"warning"}
        >
          0
        </Button>
        <Button
          size={"small"}
          onClick={() =>
            listings.map((listing) =>
              updateListingCallback(listing, {
                quantity_available:
                  listing.listing.quantity_available - quantity,
              }),
            )
          }
          color={"error"}
        >
          <RemoveRounded />
        </Button>
      </ButtonGroup>
    </Box>
  )
}

export function DisplayStock({ listings }: { listings: BaseListingType[] }) {
  const [searchState] = useMarketSearch()
  const [, setSelectedListings] = useContext(ItemStockContext)!
  const [refresh] = useMarketRefreshListingMutation()

  const filteredListings = useMemo(
    () => filterListings(listings, searchState),
    [listings, searchState],
  )

  const rows: StockRow[] = useMemo(
    () =>
      filteredListings.map((listing) => ({
        ...listing.details,
        ...listing.listing,
        image_url: listing.photos[0],
      })),
    [filteredListings],
  )

  const columns: GridColDef<StockRow>[] = [
    {
      field: "image",
      hideSortIcons: true,
      headerName: "Image",
      renderHeader: () => null,
      width: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Stack justifyContent={"center"}>
          <Avatar src={params.row.image_url} variant="rounded" />
        </Stack>
      ),
      display: "flex",
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <MaterialLink
          component={Link}
          to={formatMarketUrl({
            type: "unique",
            details: { title: params.row.title },
            listing: params.row,
          })}
          sx={{ fontWeight: "bold" }}
          underline="hover"
        >
          {params.row.title}
        </MaterialLink>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      width: 150,
      valueFormatter: (value: number) =>
        `${value.toLocaleString(undefined)} aUEC`,
    },
    {
      field: "quantity_available",
      headerName: "Quantity",
      width: 120,
      valueFormatter: (value: number) => value.toLocaleString(undefined),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      display: "flex",
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          color={params.value === "active" ? "success" : "error"}
          justifyContent={"center"}
          alignContent={"center"}
          display={"flex"}
          alignItems={"center"}
        >
          <RadioButtonCheckedRounded
            fontSize="small"
            style={{ marginRight: 1 }}
          />{" "}
          {params.value === "active" ? "Active" : "Inactive"}
        </Typography>
      ),
    },
    {
      field: "expiration",
      headerName: "Expiration",
      renderHeader: () => <RefreshCircle />,
      width: 50,
      renderCell: (params: GridRenderCellParams) => (
        <div>
          {new Date(params.value) > new Date() ? (
            formatMostSignificantDiff(params.value)
          ) : (
            <IconButton
              sx={{ color: "error.main" }}
              onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()
                refresh(params.row.listing_id)
              }}
            >
              <RefreshOutlined />
            </IconButton>
          )}
        </div>
      ),
    },
    {
      sortable: false,
      field: "listing_id",
      renderHeader: () => null,
      headerName: "Edit",
      width: 50,
      renderCell: (params: GridRenderCellParams) => (
        <Link to={`/market_edit/${params.value}`} style={{ color: "inherit" }}>
          <IconButton>
            <CreateRounded />
          </IconButton>
        </Link>
      ),
    },
  ]

  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>({ type: "include", ids: new Set() })

  useEffect(() => {
    setSelectedListings(
      [...rowSelectionModel.ids]
        .map(
          (id) =>
            listings.find((listing) => listing.listing.listing_id === id)!,
        )
        .filter((x) => x), // filter not null
    )
  }, [rowSelectionModel, listings])

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.listing_id}
        checkboxSelection
        onRowSelectionModelChange={setRowSelectionModel}
        rowSelectionModel={rowSelectionModel}
        sx={{
          borderColor: "outline.main",
          [`& .MuiDataGrid-cell, & .MuiDataGrid-filler > *, & .MuiDataGrid-footerContainer, & .MuiDataGrid-columnSeparator`]:
            {
              borderColor: "outline.main",
            },
          ".MuiDataGrid-columnSeparator": {
            color: "outline.main",
          },
          [".MuiDataGrid-menu"]: {
            color: "white",
          },
        }}
      />
    </Box>
  )
}

export function MyItemStock() {
  const [currentOrg] = useCurrentOrg()
  const { data: listings } = useMarketGetMyListingsQuery(
    currentOrg?.spectrum_id,
  )
  const filteredListings = useMemo(
    () =>
      (listings || []).filter(
        (l) => l.type !== "multiple" && l.listing.status !== "archived",
      ) as BaseListingType[],
    [listings],
  )

  return <DisplayStock listings={filteredListings} />
}
