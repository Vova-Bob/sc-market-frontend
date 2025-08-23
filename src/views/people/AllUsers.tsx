import React, { MouseEventHandler, useMemo, useState } from "react"
import { Section } from "../../components/paper/Section"
import {
  Avatar,
  Grid,
  Link as MaterialLink,
  TableCell,
  TableRow,
  Theme,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
} from "@mui/material"
import { AdminUser } from "../../datatypes/User"
import { Link } from "react-router-dom"
import { styled } from "@mui/material/styles"
import { HeadCell, PaginatedTable } from "../../components/table/PaginatedTable"
import { UnderlineLink } from "../../components/typography/UnderlineLink"
import {
  useGetAdminUsersQuery,
  useGetActivityAdminQuery,
  useGetMembershipAnalyticsQuery,
} from "../../store/admin"
import { DynamicApexChart } from "../../components/charts/DynamicCharts"
import { useTranslation } from "react-i18next"

function PeopleRow(props: {
  row: AdminUser
  index: number
  onClick?: MouseEventHandler
  isItemSelected: boolean
  labelId: string
}): JSX.Element {
  const { row, onClick, isItemSelected, labelId } = props
  return (
    <TableRow
      hover
      onClick={onClick}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row.username}
      selected={isItemSelected}
    >
      {/*<TableCell padding="checkbox">*/}
      {/*    <Checkbox*/}
      {/*        color="primary"*/}
      {/*        checked={isItemSelected}*/}
      {/*        inputProps={{*/}
      {/*            'aria-labelledby': labelId,*/}
      {/*        }}*/}
      {/*    />*/}
      {/*</TableCell>*/}
      <TableCell
        component="th"
        id={labelId}
        scope="row"
        // padding="none"
      >
        <Grid container spacing={2}>
          <Grid item>
            <Avatar src={row.avatar} />
          </Grid>
          <Grid item>
            <MaterialLink
              component={Link}
              to={`/user/${row.username}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <UnderlineLink
                color={"text.secondary"}
                variant={"subtitle1"}
                fontWeight={"bold"}
              >
                {row.username}
              </UnderlineLink>
            </MaterialLink>
            <Typography variant={"subtitle2"}>{row.display_name}</Typography>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell
        component="th"
        id={labelId}
        scope="row"
        // padding="none"
        align={"right"}
      >
        <Typography variant={"subtitle2"}>
          {new Date(row.created_at).toLocaleDateString()}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography
          variant={"subtitle1"}
          color={"primary"}
          sx={{
            textTransform: "capitalize",
          }}
        >
          {row.role}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          {row.banned && <Chip label="Banned" color="error" size="small" />}
          {!row.rsi_confirmed && (
            <Chip label="Unverified" color="warning" size="small" />
          )}
        </Box>
      </TableCell>
    </TableRow>
  )
}

const SearchIconWrapper = styled("div")((args: { theme: Theme }) => ({
  padding: args.theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}))

const headCells: readonly HeadCell<AdminUser>[] = [
  {
    id: "username",
    numeric: false,
    disablePadding: false,
    label: "adminUsers.username",
  },
  {
    id: "created_at",
    numeric: true,
    disablePadding: false,
    label: "adminUsers.date_joined",
  },
  {
    id: "role",
    numeric: true,
    disablePadding: false,
    label: "adminUsers.role",
  },
  {
    id: "banned",
    numeric: true,
    disablePadding: false,
    label: "adminUsers.status",
  },
]

export function AdminUserList(props: {
  contractors?: boolean
  members?: boolean
  customers?: boolean
}): JSX.Element {
  const { t } = useTranslation()
  const [roleFilter, setRoleFilter] = useState<"user" | "admin" | undefined>(
    undefined,
  )
  const [bannedFilter, setBannedFilter] = useState<boolean | undefined>(
    undefined,
  )
  const [rsiFilter, setRsiFilter] = useState<boolean | undefined>(undefined)

  const { data: usersResponse, isLoading } = useGetAdminUsersQuery({
    page: 1,
    page_size: 20,
    role: roleFilter,
    banned: bannedFilter,
    rsi_confirmed: rsiFilter,
  })

  const users = usersResponse?.users || []
  const pagination = usersResponse?.pagination

  return (
    <>
      <Section xs={12} title={t("adminUsers.users")} disablePadding>
        {/* Filters */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 140, flexShrink: 0 }}>
            <InputLabel>{t("adminUsers.role")}</InputLabel>
            <Select
              value={roleFilter || ""}
              label={t("adminUsers.role")}
              onChange={(e) => {
                setRoleFilter(e.target.value as "user" | "admin" | undefined)
              }}
            >
              <MenuItem value="">{t("adminUsers.all_roles")}</MenuItem>
              <MenuItem value="user">{t("adminUsers.user")}</MenuItem>
              <MenuItem value="admin">{t("adminUsers.admin")}</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140, flexShrink: 0 }}>
            <InputLabel>{t("adminUsers.banned_status")}</InputLabel>
            <Select
              value={bannedFilter === undefined ? "" : bannedFilter.toString()}
              label={t("adminUsers.banned_status")}
              onChange={(e) => {
                setBannedFilter(
                  e.target.value === "" ? undefined : e.target.value === "true",
                )
              }}
            >
              <MenuItem value="">{t("adminUsers.all_users")}</MenuItem>
              <MenuItem value="false">{t("adminUsers.active_users")}</MenuItem>
              <MenuItem value="true">{t("adminUsers.banned_users")}</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140, flexShrink: 0 }}>
            <InputLabel>{t("adminUsers.verification")}</InputLabel>
            <Select
              value={rsiFilter === undefined ? "" : rsiFilter.toString()}
              label={t("adminUsers.verification")}
              onChange={(e) => {
                setRsiFilter(
                  e.target.value === "" ? undefined : e.target.value === "true",
                )
              }}
            >
              <MenuItem value="">{t("adminUsers.all_verification")}</MenuItem>
              <MenuItem value="true">{t("adminUsers.verified")}</MenuItem>
              <MenuItem value="false">{t("adminUsers.unverified")}</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {isLoading ? null : (
          <PaginatedTable
            rows={users}
            initialSort={"username"}
            generateRow={PeopleRow}
            keyAttr={"username"}
            headCells={headCells.map((cell) => ({
              ...cell,
              label: t(cell.label),
            }))}
            disableSelect
          />
        )}
      </Section>
    </>
  )
}

export function AdminDailyActivity() {
  const { data } = useGetActivityAdminQuery()
  const { t } = useTranslation()

  return (
    <>
      <Section xs={12} title={t("adminUsers.daily_activity")}>
        <Grid item xs={12}>
          <DynamicApexChart
            width={"100%"}
            height={400}
            type={"area"}
            options={{
              xaxis: {
                type: "datetime",
                // categories: data,
                // labels: {
                //     format: 'dd/MM',
                // }
              },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                curve: "smooth",
              },
              fill: {
                type: "gradient",
                gradient: {
                  shadeIntensity: 1,
                  inverseColors: false,
                  opacityFrom: 0.45,
                  opacityTo: 0.05,
                  stops: [20, 100, 100, 100],
                },
              },
              tooltip: {
                x: {
                  format: "dd/MM/yy",
                },
              },
            }}
            series={[
              {
                name: t("adminUsers.active_users"),
                data: (data?.daily || []).map((u, i) => [
                  +new Date(u.date),
                  u.count,
                ]),
              },
            ]}
          />
        </Grid>
      </Section>
      <Section xs={12} title={t("adminUsers.weekly_activity")}>
        <Grid item xs={12}>
          <DynamicApexChart
            width={"100%"}
            height={400}
            type={"area"}
            options={{
              xaxis: {
                type: "datetime",
                // categories: data,
                // labels: {
                //     format: 'dd/MM',
                // }
              },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                curve: "smooth",
              },
              fill: {
                type: "gradient",
                gradient: {
                  shadeIntensity: 1,
                  inverseColors: false,
                  opacityFrom: 0.45,
                  opacityTo: 0.05,
                  stops: [20, 100, 100, 100],
                },
              },
              tooltip: {
                x: {
                  format: "dd/MM/yy",
                },
              },
            }}
            series={[
              {
                name: t("adminUsers.active_users"),
                data: (data?.weekly || []).map((u, i) => [
                  +new Date(u.date),
                  u.count,
                ]),
              },
            ]}
          />
        </Grid>
      </Section>
      <Section xs={12} title={t("adminUsers.monthly_activity")}>
        <Grid item xs={12}>
          <DynamicApexChart
            width={"100%"}
            height={400}
            type={"area"}
            options={{
              xaxis: {
                type: "datetime",
                // categories: data,
                // labels: {
                //     format: 'dd/MM',
                // }
              },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                curve: "smooth",
              },
              fill: {
                type: "gradient",
                gradient: {
                  shadeIntensity: 1,
                  inverseColors: false,
                  opacityFrom: 0.45,
                  opacityTo: 0.05,
                  stops: [20, 100, 100, 100],
                },
              },
              tooltip: {
                x: {
                  format: "dd/MM/yy",
                },
              },
            }}
            series={[
              {
                name: t("adminUsers.active_users"),
                data: (data?.monthly || []).map((u, i) => [
                  +new Date(u.date),
                  u.count,
                ]),
              },
            ]}
          />
        </Grid>
      </Section>
    </>
  )
}

export function AdminMembershipAnalytics() {
  const { data, isLoading, error } = useGetMembershipAnalyticsQuery()
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <Section xs={12} title={t("adminUsers.membership_count")}>
        <Grid item xs={12}>
          <div>Loading membership analytics...</div>
        </Grid>
      </Section>
    )
  }

  if (error) {
    return (
      <Section xs={12} title={t("adminUsers.membership_count")}>
        <Grid item xs={12}>
          <div>Error loading membership analytics: {JSON.stringify(error)}</div>
        </Grid>
      </Section>
    )
  }

  if (!data || !data.daily || data.daily.length === 0) {
    return (
      <Section xs={12} title={t("adminUsers.membership_count")}>
        <Grid item xs={12}>
          <div>No membership data available</div>
        </Grid>
      </Section>
    )
  }

  return (
    <Section xs={12} title={t("adminUsers.membership_count")}>
      <Grid item xs={12}>
        <DynamicApexChart
          width={"100%"}
          height={400}
          type={"area"}
          options={{
            xaxis: {
              type: "datetime",
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              curve: "smooth",
            },
            fill: {
              type: "gradient",
              gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [20, 100, 100, 100],
              },
            },
            tooltip: {
              x: {
                format: "dd/MM/yy",
              },
            },
          }}
          series={[
            {
              name: t("adminUsers.active_users"),
              data: data.daily.map((u) => [+new Date(u.date), u.count]),
            },
          ]}
        />
      </Grid>
    </Section>
  )
}
