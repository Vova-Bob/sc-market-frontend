import { Section } from "../../components/paper/Section"
import {
  Avatar,
  Chip,
  Fade,
  LinearProgress,
  TableCell,
  TableRow,
} from "@mui/material"
import React, { MouseEventHandler } from "react"
import { LocalShipping } from "@mui/icons-material"
import { ScrollableTable } from "../../components/table/ScrollableTable"
import {
  ActiveDelivery,
  makeActiveDeliveries,
} from "../../datatypes/Deliveries"
import { HeadCell } from "../../components/table/PaginatedTable"

const statusColors = new Map<
  string,
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
>()
statusColors.set("OK", "success")
statusColors.set("Damaged", "warning")
statusColors.set("Low Fuel", "warning")
statusColors.set("Off Course", "warning")
statusColors.set("Under Attack", "error")
statusColors.set("Offline", "error")

export function ActiveDeliveryTableRow(props: {
  row: ActiveDelivery
  index: number
  onClick?: MouseEventHandler
  isItemSelected: boolean
  labelId: string
}) {
  const { row, index, isItemSelected } = props
  return (
    <Fade
      in={true}
      style={{
        transitionDelay: `${50 + 50 * index}ms`,
        transitionDuration: "500ms",
      }}
    >
      <TableRow
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        hover
        // onClick={onClick}
        onClick={() => {}}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={index}
        selected={isItemSelected}
      >
        <TableCell component="th" scope="row">
          <Avatar>
            <LocalShipping />
          </Avatar>
        </TableCell>
        <TableCell>{row.location}</TableCell>
        <TableCell>{row.departure}</TableCell>
        <TableCell>{row.destination}</TableCell>
        <TableCell>
          <Chip
            color={statusColors.get(row.status) || "info"}
            label={row.status}
          />
        </TableCell>
        <TableCell align="right" colSpan={2}>
          <LinearProgress
            variant="determinate"
            value={row.progress}
            sx={{ width: "100%" }}
          />
        </TableCell>
      </TableRow>
    </Fade>
  )
}

export const activeDeliveryHeadCells: readonly HeadCell<ActiveDelivery>[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "",
    noSort: true,
  },
  {
    id: "location",
    numeric: false,
    disablePadding: false,
    label: "Location",
  },
  {
    id: "departure",
    numeric: false,
    disablePadding: false,
    label: "Start",
  },
  {
    id: "destination",
    numeric: false,
    disablePadding: false,
    label: "End",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "progress",
    numeric: true,
    disablePadding: false,
    label: "Progress",
  },
]

export function ActiveDeliveries() {
  const deliveries = makeActiveDeliveries()

  return (
    <Section
      xs={12}
      md={12}
      lg={12}
      xl={12}
      title={"Active Deliveries"}
      disablePadding
    >
      <ScrollableTable
        rows={deliveries}
        initialSort={"id"}
        generateRow={ActiveDeliveryTableRow}
        headCells={activeDeliveryHeadCells}
        keyAttr={"id"}
        disableSelect
        sx={{ maxHeight: 435 }}
      />
    </Section>
  )
}
