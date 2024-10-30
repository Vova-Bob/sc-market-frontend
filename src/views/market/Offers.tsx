import { Section } from "../../components/paper/Section"
import React, { MouseEventHandler, useCallback, useMemo } from "react"
import { HeadCell, PaginatedTable } from "../../components/table/PaginatedTable"
import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  FormGroup,
  Switch,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material"
import {
  MarketListing,
  MarketOffer,
  UniqueListing,
} from "../../datatypes/MarketListing"
import { Link } from "react-router-dom"
import { UnderlineLink } from "../../components/typography/UnderlineLink"
import { getRelativeTime } from "../../util/time"
import { statusColors } from "../orders/OrderList"
import { useCreateListing, useMarketAcceptOffer } from "../../store/market"
import { useAlertHook } from "../../hooks/alert/AlertHook"

export interface OfferRowProps {
  row: MarketOffer & { total: number }
  index: number
  onClick?: MouseEventHandler
  isItemSelected: boolean
  labelId: string
}

export function OfferRow(props: OfferRowProps): JSX.Element {
  const { row, index, isItemSelected } = props // TODO: Add `assigned_to` column

  const [
    acceptOffer, // This is the mutation trigger
  ] = useMarketAcceptOffer()

  const issueAlert = useAlertHook()

  const handleAcceptOffer = useCallback(
    async (event: any) => {
      const res: { data?: any; error?: any } = await acceptOffer({
        listing_id: row.listing_id,
        offer_id: row.offer_id,
      })

      if (res?.data && !res?.error) {
        issueAlert({
          message: "Accepted offer!",
          severity: "success",
        })
      } else {
        issueAlert({
          message: `Failed to accept offer! ${
            res.error?.error || res.error?.data?.error || res.error || res.error
          }`,
          severity: "error",
        })
      }

      return false
    },
    [acceptOffer, row.listing_id, row.offer_id, issueAlert],
  )

  return (
    <TableRow
      hover
      // onClick={onClick}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={index}
      selected={isItemSelected}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <TableCell>
        {
          <Link
            to={`/user/${row.user?.username}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <UnderlineLink
              color={"text.secondary"}
              variant={"subtitle1"}
              noWrap
            >
              {row.user?.username}
            </UnderlineLink>
          </Link>
        }
      </TableCell>

      <TableCell align={"right"}>
        {getRelativeTime(new Date(row.timestamp))}
      </TableCell>
      <TableCell align="right">
        <Typography variant={"subtitle1"} color={"text.primary"}>
          {row.offer.toLocaleString("en-US")} aUEC
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant={"subtitle1"} color={"text.primary"}>
          {row.quantity.toLocaleString("en-US")}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant={"subtitle1"} color={"secondary"}>
          {row.total.toLocaleString("en-US")} aUEC
        </Typography>
      </TableCell>

      <TableCell align={"right"}>
        <Button
          color={"primary"}
          variant={"outlined"}
          onClick={handleAcceptOffer}
        >
          Accept
        </Button>
      </TableCell>
    </TableRow>
  )
}

export const OffersHeadCells: readonly HeadCell<
  MarketOffer & { total: number }
>[] = [
  {
    id: "user",
    numeric: false,
    disablePadding: false,
    label: "User",
    minWidth: 135,
  },
  {
    id: "timestamp",
    numeric: false,
    disablePadding: false,
    label: "",
  },
  {
    id: "offer",
    numeric: true,
    disablePadding: false,
    label: "Offer",
    minWidth: 135,
  },
  {
    id: "quantity",
    numeric: true,
    disablePadding: false,
    label: "Quantity",
    minWidth: 135,
  },
  {
    id: "total",
    numeric: true,
    disablePadding: false,
    label: "Total",
  },
  {
    id: "offer_id",
    numeric: false,
    disablePadding: false,
    label: "",
  },
]
