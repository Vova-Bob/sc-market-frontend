import React, { MouseEventHandler, useMemo } from "react"
import { Section } from "../../components/paper/Section"
import {
  Avatar,
  Grid,
  Link as MaterialLink,
  TableCell,
  TableRow,
  Theme,
  Typography,
} from "@mui/material"
import { User } from "../../datatypes/User"
import { Link } from "react-router-dom"
import { styled } from "@mui/material/styles"
import { HeadCell, PaginatedTable } from "../../components/table/PaginatedTable"
import { UnderlineLink } from "../../components/typography/UnderlineLink"
import { useProfileGetAllUsers } from "../../store/profile"
import Chart from "react-apexcharts"
import { useGetActivityAdminQuery } from "../../store/admin"

function PeopleRow(props: {
  row: User & { role: string }
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
          {new Date(row.created_at!).toISOString()}
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

const headCells: readonly HeadCell<User & { role: string }>[] = [
  {
    id: "username",
    numeric: false,
    disablePadding: false,
    label: "Username",
  },
  {
    id: "created_at",
    numeric: true,
    disablePadding: false,
    label: "Date Joined",
  },
  {
    id: "role",
    numeric: true,
    disablePadding: false,
    label: "Role",
  },
]

export function AdminUserList(props: {
  contractors?: boolean
  members?: boolean
  customers?: boolean
}): JSX.Element {
  const { data: users, isLoading } = useProfileGetAllUsers()

  const data = useMemo(() => {
    const sorted_users = [...(users || [])]
      .sort((a, b) => a.created_at! - b.created_at!)
      .map((u) => new Date(u.created_at || 0).toISOString())
    return sorted_users
  }, [users])

  const data2 = useMemo(() => {
    const sorted_users = [...(users || [])]
      .filter((u) => !u.username.startsWith("new_user"))
      .sort((a, b) => a.created_at! - b.created_at!)
      .map((u) => new Date(u.created_at || 0).toISOString())
    return sorted_users
  }, [users])

  return (
    <>
      <Section xs={12} title={"Users"} disablePadding>
        {isLoading ? null : (
          <PaginatedTable
            rows={users || []}
            initialSort={"username"}
            generateRow={PeopleRow}
            keyAttr={"username"}
            headCells={headCells}
            disableSelect
          />
        )}
      </Section>
      <Section xs={12} title={"Membership Count"}>
        <Grid item xs={12}>
          {/* @ts-ignore */}
          <Chart
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
                  format: "dd/MM/yy HH:mm",
                },
              },
            }}
            series={[
              {
                name: "Users",
                data: data.map((u, i) => [u, i + 1]),
              },
              {
                name: "Verified Users",
                data: data2.map((u, i) => [u, i + 1]),
              },
            ]}
          />
        </Grid>
      </Section>
    </>
  )
}

export function AdminDailyActivity() {
  const { data } = useGetActivityAdminQuery()

  return (
    <>
      <Section xs={12} title={"Daily Activity"}>
        <Grid item xs={12}>
          <Chart
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
                name: "Active Users",
                data: (data?.daily || []).map((u, i) => [
                  +new Date(u.date),
                  u.count,
                ]),
              },
            ]}
          />
        </Grid>
      </Section>
      <Section xs={12} title={"Weekly Activity"}>
        <Grid item xs={12}>
          <Chart
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
                name: "Active Users",
                data: (data?.weekly || []).map((u, i) => [
                  +new Date(u.date),
                  u.count,
                ]),
              },
            ]}
          />
        </Grid>
      </Section>
      <Section xs={12} title={"Monthly Activity"}>
        <Grid item xs={12}>
          <Chart
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
                name: "Active Users",
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
