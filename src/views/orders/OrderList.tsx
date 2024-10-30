import { OrderStub } from "../../datatypes/Order"
import React, { MouseEventHandler, useMemo, useState } from "react"
import {
  Avatar,
  Chip,
  Link as MaterialLink,
  Paper,
  Tab,
  TableCell,
  TableRow,
  Tabs,
  Typography,
  useMediaQuery,
} from "@mui/material"
import { UnderlineLink } from "../../components/typography/UnderlineLink"
import { Link } from "react-router-dom"
import { useTheme } from "@mui/material/styles"
import { ExtendedTheme } from "../../hooks/styles/Theme"
import { HeadCell, PaginatedTable } from "../../components/table/PaginatedTable"
import { Stack } from "@mui/system"
import { a11yProps } from "../../components/tabs/Tabs"
import { Section } from "../../components/paper/Section"
import SCMarketLogo from "../../assets/scmarket-logo.png"

export const statusColors = new Map<
  | "active"
  | "inactive"
  | "fulfilled"
  | "in-progress"
  | "not-started"
  | "cancelled",
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
>()
statusColors.set("fulfilled", "success")
statusColors.set("in-progress", "info")
statusColors.set("cancelled", "warning")
statusColors.set("not-started", "error")
statusColors.set("active", "success")
statusColors.set("inactive", "warning")

export const statusNames = new Map<
  | "active"
  | "inactive"
  | "fulfilled"
  | "in-progress"
  | "not-started"
  | "cancelled",
  string
>()
statusNames.set("fulfilled", "Fulfilled")
statusNames.set("in-progress", "In Progress")
statusNames.set("cancelled", "Cancelled")
statusNames.set("not-started", "Not Started")
statusNames.set("active", "Active")
statusNames.set("inactive", "Inactive")

export const OrderHeadCells: readonly HeadCell<
  OrderStub & { other_name: string | null }
>[] = [
  {
    id: "timestamp",
    numeric: false,
    disablePadding: false,
    label: "Order",
  },
  {
    id: "other_name",
    numeric: true,
    disablePadding: false,
    label: "Customer",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Status",
  },
]

export const MyOrderHeadCells: readonly HeadCell<
  OrderStub & { other_name: string | null }
>[] = [
  {
    id: "timestamp",
    numeric: false,
    disablePadding: false,
    label: "Order",
  },
  {
    id: "other_name",
    numeric: true,
    disablePadding: false,
    label: "Contractor",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Status",
  },
]

export function OrderRow(props: {
  row: OrderStub & { mine?: boolean }
  index: number
  onClick?: MouseEventHandler
  isItemSelected: boolean
  labelId: string
}) {
  const { row, index, isItemSelected } = props // TODO: Add `assigned_to` column
  const date = useMemo(() => new Date(row.timestamp), [row.timestamp])
  const theme = useTheme()
  const statusColor = useMemo(() => statusColors.get(row.status), [row.status])
  const status = useMemo(() => statusNames.get(row.status), [row.status])

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
      component={Link}
      to={`/contract/${row.order_id}`}
    >
      <TableCell>
        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          justifyContent="left"
        >
          <Paper
            sx={{ padding: 0.5, bgcolor: theme.palette.background.default }}
          >
            <Stack
              direction={"column"}
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant={"subtitle2"} color={"text.secondary"}>
                {date.toLocaleString("default", { month: "short" })}
              </Typography>
              <Typography
                variant={"h5"}
                fontWeight={"bold"}
                color={"text.secondary"}
              >
                {date.getDate()}
              </Typography>
            </Stack>
          </Paper>
          <Stack direction={"column"}>
            <Typography color={"text.secondary"} fontWeight={"bold"}>
              Order {row.order_id.substring(0, 8).toUpperCase()}
            </Typography>
            <Typography variant={"body2"}>
              {row.count
                ? `${row.count.toLocaleString(undefined)} items • `
                : row.service_name
                ? `${row.service_name} • `
                : ""}
              {(+row.cost).toLocaleString(undefined)} aUEC
            </Typography>
          </Stack>
        </Stack>
      </TableCell>
      <TableCell align={"right"}>
        <Stack
          spacing={1}
          direction={"row"}
          justifyContent={"right"}
          alignItems={"center"}
        >
          <Avatar
            src={
              (row.mine
                ? row.contractor?.avatar || row.assigned_to?.avatar
                : row.customer.avatar) || SCMarketLogo
            }
          />
          <Stack
            direction={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <MaterialLink
              component={Link}
              to={
                row.mine
                  ? row.contractor
                    ? `/contractor/${row.contractor?.spectrum_id}`
                    : row.assigned_to
                    ? `/user/${row.assigned_to?.username}`
                    : "#"
                  : `/user/${row.customer.username}`
              }
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <UnderlineLink
                color={"text.secondary"}
                variant={"subtitle1"}
                fontWeight={"bold"}
              >
                {row.mine
                  ? row.contractor?.spectrum_id ||
                    row.assigned_to?.username ||
                    "Public"
                  : row.customer.username}
              </UnderlineLink>
            </MaterialLink>
            <Typography variant={"subtitle2"}>
              {row.mine
                ? row.assigned_to?.display_name || row.contractor?.name
                : row.customer.display_name}
            </Typography>
          </Stack>
        </Stack>
      </TableCell>
      <TableCell align={"right"}>
        <Chip label={status} color={statusColor} />
      </TableCell>
      {/*<TableCell align="right">*/}
      {/*  <Typography variant={"subtitle1"} color={"text.primary"}>*/}
      {/*    {(+row.cost).toLocaleString("en-US")} aUEC*/}
      {/*  </Typography>*/}
      {/*</TableCell>*/}

      {/*<TableCell align={'right'}>*/}
      {/*    <Button color={'primary'} variant={'outlined'} onClick={handleAcceptBid}>*/}
      {/*        Accept*/}
      {/*    </Button>*/}
      {/*</TableCell>*/}
    </TableRow>
  )
}

export function OrdersView(props: {
  title: string
  orders: OrderStub[]
  mine?: boolean
}) {
  const { title, orders, mine } = props

  const [statusFilter, setStatusFilter] = useState<null | "active" | "past">(
    null,
  )

  const rows = useMemo(() => {
    return (orders || []).filter((o) => {
      if (statusFilter === "active") {
        return !["fulfilled", "cancelled"].includes(o.status)
      }
      if (statusFilter === "past") {
        return ["fulfilled", "cancelled"].includes(o.status)
      }

      return true
    })
  }, [orders, statusFilter])

  const theme = useTheme<ExtendedTheme>()
  const xs = useMediaQuery(theme.breakpoints.down("lg"))

  const page = useMemo(
    () => [null, "active", "past"].indexOf(statusFilter),
    [statusFilter],
  )

  return (
    <Section
      xs={12}
      md={12}
      lg={12}
      xl={12}
      fill
      element_title={
        <Stack
          justifyContent={"space-between"}
          alignItems={"center"}
          spacing={1}
          direction={"row"}
        >
          <Typography
            variant={"h5"}
            fontWeight={"bold"}
            color={"text.secondary"}
          >
            {title}
          </Typography>
          <Tabs
            value={page}
            // onChange={(_, newPage) => setPage(newPage)}
            aria-label="order tabs"
            variant="scrollable"
          >
            <Tab
              label="All"
              icon={<Chip label={orders?.length || 0} size={"small"} />}
              {...a11yProps(0)}
              onClick={() => setStatusFilter(null)}
            />
            <Tab
              label="Active"
              icon={
                <Chip
                  label={
                    (orders || []).filter(
                      (o) => !["fulfilled", "cancelled"].includes(o.status),
                    ).length
                  }
                  size={"small"}
                />
              }
              {...a11yProps(1)}
              onClick={() => setStatusFilter("active")}
            />
            <Tab
              label="Past"
              icon={
                <Chip
                  label={
                    (orders || []).filter((o) =>
                      ["fulfilled", "cancelled"].includes(o.status),
                    ).length
                  }
                  size={"small"}
                />
              }
              {...a11yProps(2)}
              onClick={() => setStatusFilter("past")}
            />
          </Tabs>
        </Stack>
      }
      disablePadding
    >
      <PaginatedTable
        rows={rows.map((o) => ({
          ...o,
          other_name: mine
            ? o.assigned_to?.username || o.contractor?.spectrum_id || null
            : o.customer.username,
          mine,
        }))}
        initialSort={"timestamp"}
        generateRow={OrderRow}
        keyAttr={"order_id"}
        initialSortDirection={"desc"}
        headCells={mine ? MyOrderHeadCells : OrderHeadCells}
        disableSelect
      />
    </Section>
  )
}
