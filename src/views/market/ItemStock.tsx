import React, { useCallback, useContext, useMemo, useState } from "react"
import { BaseListingType } from "../../datatypes/MarketListing"
import { useMarketSearch } from "../../hooks/market/MarketSearch"
import {
  useMarketGetMyListingsQuery,
  useMarketUpdateListingQuantityMutation,
} from "../../store/market"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { HeadCell } from "../../components/table/PaginatedTable"
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  Grid,
  Link as MaterialLink,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableRow,
  tableRowClasses,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import {
  AddRounded,
  RadioButtonCheckedRounded,
  RemoveRounded,
} from "@mui/icons-material"
import { useTheme } from "@mui/material/styles"
import { ExtendedTheme } from "../../hooks/styles/Theme"
import { filterListings } from "./ItemListings"
import { Link } from "react-router-dom"
import { Stack } from "@mui/system"
import { NumericFormat } from "react-number-format"
import { formatMarketUrl } from "../../util/urls"

export const mobileHeadCells: readonly HeadCell<StockRow>[] = [
  {
    id: "title",
    numeric: false,
    disablePadding: false,
    label: "Title",
  },
  {
    id: "quantity_available",
    numeric: false,
    disablePadding: false,
    label: "Current Quantity",
  },
  {
    id: "quantity_available",
    numeric: true,
    disablePadding: false,
    label: "",
  },
]

export interface StockRow {
  title: string
  quantity_available: number
  listing_id: string
  price: number
  status: string
  image_url: string
}

export interface StockRowProps {
  row: StockRow
  index: number
  selected: boolean
  onSelected: () => void
}

export function ManageStockArea(props: { listing: StockRow }) {
  const [quantity, setQuantity] = useState(1)
  const { listing } = props

  const [
    updateListing, // This is the mutation trigger
  ] = useMarketUpdateListingQuantityMutation()

  const issueAlert = useAlertHook()

  const updateListingCallback = useCallback(
    async (body: { quantity_available: number }) => {
      let res: { data?: any; error?: any }

      updateListing({
        listing_id: listing.listing_id,
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
    [listing.listing_id, issueAlert, updateListing],
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
        onValueChange={async (values, sourceInfo) => {
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
            updateListingCallback({
              quantity_available: listing.quantity_available + quantity,
            })
          }
          color={"success"}
        >
          <AddRounded />
        </Button>
        <Button
          size={"small"}
          onClick={() => updateListingCallback({ quantity_available: 0 })}
          color={"warning"}
        >
          0
        </Button>
        <Button
          size={"small"}
          onClick={() =>
            updateListingCallback({
              quantity_available: listing.quantity_available - quantity,
            })
          }
          color={"error"}
        >
          <RemoveRounded />
        </Button>
      </ButtonGroup>
    </Box>
  )
}

export function MobileStockRow(props: StockRowProps) {
  const { row: listing, index, selected, onSelected } = props // TODO: Add `assigned_to` column
  const theme = useTheme<ExtendedTheme>()

  const md = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <TableRow
      hover
      role="checkbox"
      tabIndex={-1}
      key={index}
      onClick={onSelected}
      selected={selected}
      // component={Link} to={`/contract/${row.order_id}`}
      sx={{
        textDecoration: "none",
        color: "inherit",
        borderBottom: "none",
        border: "none",
        [`& .${tableCellClasses.root}`]: {
          paddingTop: 0,
          paddingBottom: 0,
        },
        [`& .${tableRowClasses.root}`]: {
          paddingTop: 0,
          paddingBottom: 0,
        },
      }}
    >
      <TableCell padding={"checkbox"}>
        <Checkbox checked={selected} onChange={onSelected} />
      </TableCell>
      {md ? (
        <TableCell align={"left"}>
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <Avatar src={listing.image_url} variant={"rounded"} />
            <Stack direction={"column"} justifyContent={"center"}>
              <Box
                sx={{
                  alignItems: "center",
                  display: "inline-flex",
                }}
              >
                <span
                  style={{
                    maxWidth: 200,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  <MaterialLink
                    component={Link}
                    to={formatMarketUrl({
                      type: "unique",
                      details: { title: listing.title },
                      listing,
                    })}
                    sx={{
                      fontWeight: "bold",
                    }}
                    variant={"subtitle1"}
                    underline={"hover"}
                    color={"text.secondary"}
                  >
                    {listing.title}
                  </MaterialLink>
                </span>
              </Box>

              <Typography variant={"subtitle2"}>
                {listing.price.toLocaleString("en-US")} aUEC
              </Typography>
            </Stack>
          </Stack>

          <ManageStockArea listing={listing} />
        </TableCell>
      ) : (
        <>
          <TableCell align={"left"}>
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <Avatar src={listing.image_url} variant={"rounded"} />
              <Stack direction={"column"} justifyContent={"center"}>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                >
                  <span
                    style={{
                      maxWidth: 200,
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    <MaterialLink
                      underline={"hover"}
                      component={Link}
                      to={formatMarketUrl({
                        type: "unique",
                        details: { title: listing.title },
                        listing,
                      })}
                      sx={{
                        fontWeight: "bold",
                      }}
                      variant={"subtitle1"}
                      color={"text.secondary"}
                    >
                      {listing.title}
                    </MaterialLink>
                  </span>
                </Box>
                <Typography variant={"subtitle2"}>
                  {listing.price.toLocaleString("en-US")} aUEC
                </Typography>
              </Stack>
            </Stack>
          </TableCell>
          <TableCell padding={"checkbox"}>
            <Stack>
              <Typography
                display={"inline"}
                color={listing.status === "active" ? "primary" : "error"}
              >
                {listing.status === "active" ? (
                  <RadioButtonCheckedRounded />
                ) : (
                  <RadioButtonCheckedRounded />
                )}
              </Typography>
            </Stack>
          </TableCell>

          <TableCell
            padding="checkbox"
            onClick={(event) => {
              event.stopPropagation()
            }}
            align={"right"}
          >
            <ManageStockArea listing={listing} />
          </TableCell>
        </>
      )}
    </TableRow>
  )
}

export function DisplayStock(props: { listings: BaseListingType[] }) {
  const [searchState] = useMarketSearch()
  const [selectedListings, setSelectedListings] = useContext(ItemStockContext)!
  const { listings } = props
  const theme = useTheme<ExtendedTheme>()

  const filteredListings = useMemo(
    () => filterListings(listings, searchState),
    [listings, searchState],
  )

  return (
    <Grid item xs={12}>
      <Divider light />
      <TableContainer sx={{ width: "100%" }}>
        <Table
          sx={{
            borderRadius: 2,
            [`& .${tableCellClasses.root}`]: {
              borderColor: theme.palette.outline.main,
            },
          }}
          aria-labelledby="tableTitle"
          size={"medium"}
          stickyHeader
        >
          <TableBody>
            {filteredListings.map((listing, index) => (
              <MobileStockRow
                key={listing.listing.listing_id}
                row={{
                  ...listing.details,
                  ...listing.listing,
                  image_url: listing.photos[0],
                }}
                index={index}
                selected={
                  !!selectedListings.find(
                    (selectedListing) =>
                      selectedListing.listing.listing_id ===
                      listing.listing.listing_id,
                  )
                }
                onSelected={() => {
                  if (
                    selectedListings.find(
                      (selectedListing) =>
                        selectedListing.listing.listing_id ===
                        listing.listing.listing_id,
                    )
                  ) {
                    setSelectedListings(
                      selectedListings.filter(
                        (l) =>
                          l.listing.listing_id !== listing.listing.listing_id,
                      ),
                    )
                  } else {
                    setSelectedListings([...selectedListings, listing])
                  }
                }}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  )
}

export const ItemStockContext = React.createContext<
  | [BaseListingType[], React.Dispatch<React.SetStateAction<BaseListingType[]>>]
  | null
>(null)

export function MyItemStock() {
  const [currentOrg] = useCurrentOrg()
  const { data: listings } = useMarketGetMyListingsQuery(
    currentOrg?.spectrum_id,
  )
  const filteredListings = useMemo(() => listings || [], [listings])

  return (
    <DisplayStock
      listings={
        filteredListings.filter(
          (l) => l.type !== "multiple" && l.listing.status !== "archived",
        ) as BaseListingType[]
      }
    />
  )
}
