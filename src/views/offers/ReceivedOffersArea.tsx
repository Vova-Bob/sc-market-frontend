import {
  OfferSessionStub,
  useGetReceivedOffersOrgQuery,
  useGetReceivedOffersQuery,
  useGetSentOffersQuery,
} from "../../store/offer"
import { HeadCell, PaginatedTable } from "../../components/table/PaginatedTable"
import React, { MouseEventHandler, useMemo, useState } from "react"
import {
  Avatar,
  Chip,
  Divider,
  Grid,
  Link as MaterialLink,
  Paper,
  Tab,
  TableCell,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material"
import { Link } from "react-router-dom"
import { UnderlineLink } from "../../components/typography/UnderlineLink"
import {
  Announcement,
  Cancel,
  CheckCircle,
  HourglassTop,
} from "@mui/icons-material"
import { a11yProps } from "../../components/tabs/Tabs"
import { Stack } from "@mui/system"
import { useTheme } from "@mui/material/styles"
import { Section } from "../../components/paper/Section"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"

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
  const { row, index, isItemSelected } = props // TODO: Add `assigned_to` column
  const date = useMemo(() => new Date(row.timestamp), [row.timestamp])
  const theme = useTheme()
  const [statusColor, icon] = useMemo(() => {
    if (row.status === "Waiting for Seller") {
      return ["warning" as const, <Announcement key={"warning"} />] as const
    } else if (row.status === "Waiting for Customer") {
      return ["info" as const, <HourglassTop key={"info"} />] as const
    } else if (row.status === "Rejected") {
      return ["error" as const, <Cancel key={"error"} />] as const
    } else {
      return ["success" as const, <CheckCircle key={"success"} />] as const
    }
  }, [row.status])

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
              Offer {row.id.substring(0, 8).toUpperCase()}
            </Typography>
            <Typography variant={"body2"}>
              {row.most_recent_offer.count
                ? `${row.most_recent_offer.count.toLocaleString(
                    undefined,
                  )} items • `
                : row.most_recent_offer.service_name
                ? `${row.most_recent_offer.service_name} • `
                : ""}
              {(+row.most_recent_offer.cost).toLocaleString(undefined)} aUEC
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
          <Avatar src={row.customer.avatar} />
          <Stack
            direction={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <MaterialLink
              component={Link}
              to={`/user/${row.customer.username}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <UnderlineLink
                color={"text.secondary"}
                variant={"subtitle1"}
                fontWeight={"bold"}
              >
                {row.customer.username}
              </UnderlineLink>
            </MaterialLink>
            <Typography variant={"subtitle2"}>
              {row.customer.display_name}
            </Typography>
          </Stack>
        </Stack>
      </TableCell>
      <TableCell align={"right"}>
        <Chip label={row.status} color={statusColor} icon={icon} />
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

export function OffersView(props: { offers: OfferSessionStub[] }) {
  const { offers } = props
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const filteredOffers = useMemo(() => {
    return (offers || []).filter(
      (o) => !statusFilter || o.status === statusFilter,
    )
  }, [offers, statusFilter])

  const page = useMemo(
    () =>
      [
        null,
        "Waiting for Seller",
        "Waiting for Customer",
        "Accepted",
        "Rejected",
      ].indexOf(statusFilter),
    [statusFilter],
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
            Offers
          </Typography>
          <Tabs
            value={page}
            // onChange={(_, newPage) => setPage(newPage)}
            aria-label="offer tabs"
            variant="scrollable"
          >
            <Tab
              label="All"
              icon={<Chip label={offers?.length || 0} size={"small"} />}
              {...a11yProps(0)}
              onClick={() => setStatusFilter(null)}
            />
            <Tab
              label="Waiting for Seller"
              icon={
                <Chip
                  label={
                    (offers || []).filter(
                      (x) => x.status === "Waiting for Seller",
                    ).length
                  }
                  size={"small"}
                />
              }
              {...a11yProps(1)}
              onClick={() => setStatusFilter("Waiting for Seller")}
            />
            <Tab
              label="Waiting for Customer"
              icon={
                <Chip
                  label={
                    (offers || []).filter(
                      (x) => x.status === "Waiting for Customer",
                    ).length
                  }
                  size={"small"}
                />
              }
              {...a11yProps(2)}
              onClick={() => setStatusFilter("Waiting for Customer")}
            />
            <Tab
              label="Accepted"
              icon={
                <Chip
                  label={
                    (offers || []).filter((x) => x.status === "Accepted").length
                  }
                  size={"small"}
                />
              }
              {...a11yProps(3)}
              onClick={() => setStatusFilter("Accepted")}
            />
            <Tab
              label="Rejected"
              icon={
                <Chip
                  label={
                    (offers || []).filter((x) => x.status === "Rejected").length
                  }
                  size={"small"}
                />
              }
              {...a11yProps(4)}
              onClick={() => setStatusFilter("Rejected")}
            />
          </Tabs>
        </Stack>
        <PaginatedTable
          rows={filteredOffers.map((o) => ({
            ...o,
            customer_name: o.customer.username,
          }))}
          initialSort={"timestamp"}
          generateRow={OfferRow}
          keyAttr={"id"}
          headCells={OffersHeadCells}
          disableSelect
        />
      </Paper>
    </Grid>
  )
}

export function ReceivedOffersArea() {
  const [currentOrg] = useCurrentOrg()
  const { data: userOffers } = useGetReceivedOffersQuery(undefined, {
    skip: !!currentOrg,
  })
  const { data: orgOffers } = useGetReceivedOffersOrgQuery(
    currentOrg?.spectrum_id!,
    { skip: !currentOrg },
  )

  const offers = useMemo(() => {
    if (currentOrg) {
      return orgOffers || []
    } else {
      return userOffers || []
    }
  }, [currentOrg, orgOffers, userOffers])

  return <OffersView offers={offers} />
}

export function SentOffersArea() {
  const { data: offers } = useGetSentOffersQuery()

  return <OffersView offers={offers || []} />
}
