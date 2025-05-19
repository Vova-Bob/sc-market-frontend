import { MouseEventHandler } from "react"
import { HeadCell } from "../../components/table/PaginatedTable"
import { MarketOffer } from "../../datatypes/MarketListing"

export interface OfferRowProps {
  row: MarketOffer & { total: number }
  index: number
  onClick?: MouseEventHandler
  isItemSelected: boolean
  labelId: string
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
