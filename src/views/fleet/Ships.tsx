import { Section } from "../../components/paper/Section"
import { Chip, Fade, TableCell, TableRow } from "@mui/material"
import React, { MouseEventHandler } from "react"
import { Ship } from "../../datatypes/Ship"
import { ScrollableTable } from "../../components/table/ScrollableTable"
import { HeadCell } from "../../components/table/PaginatedTable"
import { getRelativeTime } from "../../util/time"
import { useGetMyShips } from "../../store/ships"

const statusColors = new Map<
  string,
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
>()
statusColors.set("flight-ready", "success")
statusColors.set("in-repair", "warning")
statusColors.set("awaiting-repair", "error")
statusColors.set("in-concept", "info")

export function ShipTableRow(props: {
  row: Ship
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
        {/*<TableCell component="th" scope="row">*/}
        {/*    <Avatar>*/}
        {/*        <LocalShipping/>*/}
        {/*    </Avatar>*/}
        {/*</TableCell>*/}
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.manufacturer}</TableCell>
        <TableCell>{row.kind}</TableCell>
        <TableCell>
          <Chip
            color={statusColors.get(row.condition) || "info"}
            label={row.condition}
          />
        </TableCell>
        {/*<TableCell align="right">*/}
        {/*    {getRelativeTime(new Date(row.checkin_timestamp))}*/}
        {/*</TableCell>*/}
      </TableRow>
    </Fade>
  )
}

export const fleetHeadCells: readonly HeadCell<Ship>[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Ship",
  },
  {
    id: "manufacturer",
    numeric: false,
    disablePadding: false,
    label: "Manufacturer",
  },
  {
    id: "kind",
    numeric: false,
    disablePadding: false,
    label: "Kind",
  },
  {
    id: "condition",
    numeric: false,
    disablePadding: false,
    label: "Condition",
  },
  // {
  //     id: 'checkin_timestamp',
  //     numeric: true,
  //     disablePadding: false,
  //     label: 'Last Checkin',
  // },
]

export function Ships() {
  const { data: ships } = useGetMyShips()

  return (
    <Section xs={12} md={12} lg={12} xl={5} title={"Ships"} disablePadding>
      <ScrollableTable
        rows={ships || []}
        initialSort={"manufacturer"}
        generateRow={ShipTableRow}
        headCells={fleetHeadCells}
        keyAttr={"ship_id"}
        disableSelect
        sx={{ maxHeight: 855, marginBottom: 4 }}
      />
    </Section>
  )
}
