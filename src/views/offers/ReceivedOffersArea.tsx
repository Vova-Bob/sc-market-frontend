import {
  OfferSearchStatus,
  OfferSessionStub,
  useSearchOfferSessionsQuery,
} from "../../store/offer"
import {
  ControlledTable,
  HeadCell,
} from "../../components/table/PaginatedTable"
import React, { MouseEventHandler, useMemo, useState } from "react"
import {
  Chip,
  Grid,
  Paper,
  Tab,
  TableCell,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material"
import { Link } from "react-router-dom"
import {
  Announcement,
  Cancel,
  CheckCircle,
  HourglassTop,
} from "@mui/icons-material"
import { a11yProps } from "../../components/tabs/Tabs"
import { Stack } from "@mui/system"
import { useTheme } from "@mui/material/styles"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { useGetUserProfileQuery } from "../../store/profile"
import { OrderSearchSortMethod } from "../../datatypes/Order"
import { UserAvatar } from "../../components/avatar/UserAvatar"
import { useTranslation } from "react-i18next"

// Map for all statuses
const statusTextToKey: Record<string, string> = {
  "Waiting for Seller": "waitingSeller",
  "Waiting for Customer": "waitingCustomer",
  Accepted: "accepted",
  Rejected: "rejected",
}

export const OffersHeadCells: readonly HeadCell<
  OfferSessionStub & { customer_name: string }
>[] = [
  {
    id: "timestamp",
    numeric: false,
    disablePadding: false,
    label: "Offer",
  },
  {
    id: "customer",
    numeric: true,
    disablePadding: false,
    label: "User",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Status",
  },
]

export function OfferRow(props: {
  row: OfferSessionStub
  index: number
  onClick?: MouseEventHandler
  isItemSelected: boolean
  labelId: string
}) {
  const { t } = useTranslation()
  const { row, index, isItemSelected } = props
  const date = useMemo(() => new Date(row.timestamp), [row.timestamp])
  const theme = useTheme()

  // Key for translation and colour
  const statusKey = statusTextToKey[row.status] || row.status

  const [statusColor, icon] = useMemo(() => {
    if (statusKey === "waitingSeller") {
      return ["warning" as const, <Announcement key={"warning"} />] as const
    } else if (statusKey === "waitingCustomer") {
      return ["info" as const, <HourglassTop key={"info"} />] as const
    } else if (statusKey === "rejected") {
      return ["error" as const, <Cancel key={"error"} />] as const
    } else {
      return ["success" as const, <CheckCircle key={"success"} />] as const
    }
  }, [statusKey])

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
      to={`/offer/${row.id}`}
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
              {t("OffersViewPaginated.offer")}{" "}
              {row.id.substring(0, 8).toUpperCase()}
            </Typography>
            <Typography variant={"body2"}>
              {row.most_recent_offer.count
                ? `${row.most_recent_offer.count.toLocaleString(
                    undefined,
                  )} ${t("OffersViewPaginated.items")} • `
                : row.most_recent_offer.service_name
                  ? `${row.most_recent_offer.service_name} • `
                  : ""}
              {(+row.most_recent_offer.cost).toLocaleString(undefined)} aUEC
            </Typography>
          </Stack>
        </Stack>
      </TableCell>
      <TableCell align={"right"}>
        <UserAvatar user={row.customer} />
      </TableCell>
      <TableCell align={"right"}>
        <Chip
          label={t(`OffersViewPaginated.${statusKey}`, row.status)}
          color={statusColor}
          icon={icon}
        />
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

export function ReceivedOffersArea() {
  const [currentOrg] = useCurrentOrg()

  return (
    <OffersViewPaginated
      assigned={!currentOrg}
      contractor={currentOrg?.spectrum_id}
    />
  )
}

export function SentOffersArea() {
  return <OffersViewPaginated mine />
}

export function OffersViewPaginated(props: {
  mine?: boolean
  assigned?: boolean
  contractor?: string
}) {
  const { t } = useTranslation()
  const { mine, assigned, contractor } = props
  const { data: profile } = useGetUserProfileQuery()
  const [statusFilter, setStatusFilter] = useState<null | OfferSearchStatus>(
    mine ? "to-customer" : "to-seller",
  )
  const [pageSize, setPageSize] = useState(5)
  const [page, setPage] = useState(0)
  const [orderBy, setOrderBy] = useState("timestamp")
  const [order, setOrder] = useState<"asc" | "desc">("desc")

  const { data } = useSearchOfferSessionsQuery({
    status: statusFilter || undefined,
    index: page,
    page_size: pageSize,
    customer: mine ? profile?.username : undefined,
    assigned: assigned ? profile?.username : undefined,
    contractor: contractor,
    sort_method: orderBy as OrderSearchSortMethod,
    reverse_sort: order === "desc",
  })

  const tabs = [
    ["to-seller", t("OffersViewPaginated.waitingSeller")],
    ["to-customer", t("OffersViewPaginated.waitingCustomer")],
    ["accepted", t("OffersViewPaginated.accepted")],
    ["rejected", t("OffersViewPaginated.rejected")],
  ] as const

  const tab = useMemo(
    () =>
      [null, "to-seller", "to-customer", "accepted", "rejected"].indexOf(
        statusFilter,
      ),
    [statusFilter],
  )

  const totalCount = useMemo(
    () => Object.values(data?.item_counts || {}).reduce((x, y) => x + y, 0),
    [data],
  )

  const totals = useMemo(
    () => new Map(Object.entries(data?.item_counts || [])),
    [data],
  )

  return (
    <Grid item xs={12}>
      <Paper>
        <Stack
          direction={"row"}
          sx={{ paddingTop: 2, paddingLeft: 2, paddingRight: 2 }}
        >
          <Typography
            variant={"h5"}
            color={"text.secondary"}
            fontWeight={"bold"}
          >
            {t("OffersViewPaginated.offers")}
          </Typography>
          <Tabs
            value={tab}
            // onChange={(_, newPage) => setPage(newPage)}
            aria-label={t("offers.aria.offerTabs")}
            variant="scrollable"
          >
            <Tab
              label={t("OffersViewPaginated.all")}
              icon={<Chip label={totalCount} size={"small"} />}
              {...a11yProps(0)}
              onClick={() => setStatusFilter(null)}
            />
            {tabs.map(([id, tag], index) => (
              <Tab
                key={id}
                label={tag}
                icon={<Chip label={totals.get(id) || 0} size={"small"} />}
                {...a11yProps(index + 1)}
                onClick={() => setStatusFilter(id)}
              />
            ))}
          </Tabs>
        </Stack>
        <ControlledTable
          rows={(data?.items || []).map((o) => ({
            ...o,
            customer_name: o.customer.username,
          }))}
          initialSort={"timestamp"}
          generateRow={OfferRow}
          keyAttr={"id"}
          headCells={OffersHeadCells.map((cell) => ({
            ...cell,
            label: t(
              `OffersViewPaginated.${cell.label.toLowerCase()}`,
              cell.label,
            ),
          }))}
          disableSelect
          onPageChange={setPage}
          page={page}
          onPageSizeChange={setPageSize}
          pageSize={pageSize}
          rowCount={statusFilter ? totals.get(statusFilter) || 0 : totalCount}
          onOrderChange={setOrder}
          order={order}
          onOrderByChange={setOrderBy}
          orderBy={orderBy}
        />
      </Paper>
    </Grid>
  )
}
