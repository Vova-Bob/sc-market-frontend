import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
  Toolbar,
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
  RadioButtonUncheckedRounded,
  RefreshOutlined,
  RemoveRounded,
} from "@mui/icons-material"
import { useMarketSearch } from "../../hooks/market/MarketSearch"
import { filterListings } from "./ItemListings"
import { formatMarketUrl } from "../../util/urls"
import { Link } from "react-router-dom"
import {
  MarketListingUpdateBody,
  UniqueListing,
} from "../../datatypes/MarketListing"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import {
  useMarketGetMyListingsQuery,
  useMarketRefreshListingMutation,
  useMarketUpdateListingQuantityMutation,
  useUpdateMarketListing,
} from "../../store/market"
import { Stack } from "@mui/system"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { NumericFormat } from "react-number-format"
import { RefreshCircle } from "mdi-material-ui"
import { formatMostSignificantDiff } from "../../util/time"
import LoadingButton from "@mui/lab/LoadingButton"

export const ItemStockContext = React.createContext<
  | [UniqueListing[], React.Dispatch<React.SetStateAction<UniqueListing[]>>]
  | null
>(null)

export function ManageStockArea(props: { listings: UniqueListing[] }) {
  const [quantity, setQuantity] = useState(1)
  const { listings } = props

  const [updateListing] = useMarketUpdateListingQuantityMutation()

  const issueAlert = useAlertHook()

  const updateListingCallback = useCallback(
    async (listing: UniqueListing, body: { quantity_available: number }) => {
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
    <>
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
          minWidth: 200,
        }}
        size="small"
        label={"Update Amount"}
        value={quantity}
        color={"secondary"}
      />

      <ButtonGroup size={"small"}>
        <Button
          variant={"contained"}
          onClick={() =>
            listings.map((listing) =>
              updateListingCallback(listing, {
                quantity_available:
                  listing.listing.quantity_available + quantity,
              }),
            )
          }
          color={"success"}
          startIcon={<AddRounded />}
        >
          Add
        </Button>

        <Button
          variant={"contained"}
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
          variant={"contained"}
          onClick={() =>
            listings.map((listing) =>
              updateListingCallback(listing, {
                quantity_available:
                  listing.listing.quantity_available - quantity,
              }),
            )
          }
          color={"error"}
          startIcon={<RemoveRounded />}
        >
          Sub
        </Button>
      </ButtonGroup>
    </>
  )
}

export interface StockRow {
  title: string
  quantity_available: number
  listing_id: string
  price: number
  status: string
  image_url: string
  expiration: string
  order_count: number
  offer_count: number
}

function ItemStockToolbar() {
  const [selectedListings] = useContext(ItemStockContext)!

  const [updateListing, { isLoading }] = useUpdateMarketListing()
  const updateListingCallback = useCallback(
    async (body: MarketListingUpdateBody) => {
      selectedListings.forEach((listing) => {
        updateListing({
          listing_id: listing.listing.listing_id,
          body,
        })
      })
    },
    [selectedListings, updateListing],
  )

  return (
    <Toolbar>
      <ManageStockArea listings={selectedListings} />
      <LoadingButton
        color={"success"}
        startIcon={<RadioButtonCheckedRounded />}
        variant={"outlined"}
        size={"small"}
        loading={isLoading}
        onClick={() => {
          updateListingCallback({ status: "active" })
        }}
      >
        Activate
      </LoadingButton>
      <LoadingButton
        color={"error"}
        startIcon={<RadioButtonUncheckedRounded />}
        variant={"outlined"}
        size={"small"}
        loading={isLoading}
        onClick={() => {
          updateListingCallback({ status: "inactive" })
        }}
      >
        Deactivate
      </LoadingButton>
    </Toolbar>
  )
}

export function DisplayStock({ listings }: { listings: UniqueListing[] }) {
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
        ...(listing.stats || {
          offer_count: 0,
          order_count: 0,
          view_count: 0,
        }),
        image_url: listing.photos[0],
      })),
    [filteredListings],
  )

  const columns: GridColDef<StockRow>[] = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Stack
          justifyContent={"left"}
          direction={"row"}
          spacing={1}
          alignItems={"center"}
        >
          <Avatar src={params.row.image_url} variant="rounded" />
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
        </Stack>
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
      // renderHeader: () => <NumbersRounded />,
      width: 90,
      valueFormatter: (value: number) => value.toLocaleString(undefined),
    },
    {
      field: "offer_count",
      headerName: "Offers Accepted",
      width: 120,
      display: "flex",
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          variant={"subtitle2"}
          color={+params.row.offer_count === 0 ? "success" : "warning"}
        >
          {(+params.row.order_count).toLocaleString(undefined)} /{" "}
          {(+params.row.order_count + +params.row.offer_count).toLocaleString(
            undefined,
          )}
        </Typography>
      ),
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
          variant={"subtitle2"}
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
          [`& .MuiDataGrid-cell, & .MuiDataGrid-filler > *, & .MuiDataGrid-footerContainer, & .MuiDataGrid-columnSeparator, & .MuiDataGrid-toolbar`]:
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
        slots={{
          toolbar: ItemStockToolbar,
        }}
        showToolbar
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
      ) as UniqueListing[],
    [listings],
  )

  return <DisplayStock listings={filteredListings} />
}
